import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

// 5 MB maximum file size per upload
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

// Explicit allowed image MIME types and file extensions (SVG strictly disallowed)
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

/**
 * Verify authorization token against the backend auth endpoint.
 * Requires active administrative privileges.
 */
async function verifyAdminAuth(req: NextRequest): Promise<{ authorized: boolean; error?: string; status?: number }> {
  const cookieToken = req.cookies.get("tn78_auth_token")?.value;
  let authHeader = req.headers.get("authorization") || req.headers.get("Authorization");

  if ((!authHeader || authHeader === "Bearer cookie_session" || authHeader === "Bearer undefined") && cookieToken) {
    authHeader = `Bearer ${cookieToken}`;
  }

  if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader === "Bearer cookie_session") {
    return {
      authorized: false,
      error: "Unauthorized: Missing or invalid Authorization header.",
      status: 401,
    };
  }

  const backendUrl = (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8001"
  ).replace(/\/+$/, "");

  try {
    const authRes = await fetch(`${backendUrl}/api/v1/auth/me`, {
      method: "GET",
      headers: { Authorization: authHeader },
    });

    if (!authRes.ok) {
      return {
        authorized: false,
        error: "Unauthorized: Invalid or expired administrative session.",
        status: 401,
      };
    }

    const user = await authRes.json();
    if (!user.is_admin && user.role !== "super_admin") {
      return {
        authorized: false,
        error: "Forbidden: Administrative privileges required for file uploads.",
        status: 403,
      };
    }

    return { authorized: true };
  } catch (err) {
    console.error("[Upload Auth Verification Error]:", err);
    return {
      authorized: false,
      error: "Authentication service unavailable.",
      status: 503,
    };
  }
}

/**
 * Upload image buffer to Supabase Storage via REST API using server-side service key.
 */
async function uploadToSupabaseStorage({
  supabaseUrl,
  serviceKey,
  bucket,
  filename,
  data,
  contentType,
}: {
  supabaseUrl: string;
  serviceKey: string;
  bucket: string;
  filename: string;
  data: ArrayBuffer;
  contentType: string;
}): Promise<string> {
  const cleanUrl = supabaseUrl.replace(/\/+$/, "");
  const uploadUrl = `${cleanUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${encodeURIComponent(filename)}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: data,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[Supabase Storage Upload Error]:", errText);
    throw new Error(`Supabase Storage upload failed: ${res.statusText}`);
  }

  return `${cleanUrl}/storage/v1/object/public/${bucket}/${filename}`;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify that unauthenticated requests cannot upload files (check Authorization header)
    const authResult = await verifyAdminAuth(req);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    // 2. Parse uploaded form data
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const allFiles: File[] = [];
    if (files && files.length > 0) {
      allFiles.push(...files.filter((f) => f && typeof f.name === "string" && f.size > 0));
    }
    if (
      singleFile &&
      typeof singleFile.name === "string" &&
      singleFile.size > 0 &&
      !allFiles.some((f) => f.name === singleFile.name && f.size === singleFile.size)
    ) {
      allFiles.push(singleFile);
    }

    if (allFiles.length === 0) {
      return NextResponse.json({ error: "No image files provided." }, { status: 400 });
    }

    // 3. Configure storage destination: Supabase Storage prioritized
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const storageBucket = process.env.SUPABASE_STORAGE_BUCKET || "products";

    const useSupabaseStorage = Boolean(supabaseUrl && supabaseServiceKey);

    // In production, strictly mandate Supabase Storage rather than public/ directory
    if (!useSupabaseStorage && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            "Storage configuration error: SUPABASE_SERVICE_ROLE_KEY is required on the server for production storage.",
        },
        { status: 500 }
      );
    }

    let localUploadDir = "";
    if (!useSupabaseStorage) {
      console.warn(
        "[Security Notice] SUPABASE_SERVICE_ROLE_KEY not configured. Falling back to local storage in development mode."
      );
      localUploadDir = path.join(process.cwd(), "public", "images", "products");
      await fs.mkdir(localUploadDir, { recursive: true });
    }

    const uploadedUrls: { url: string; filename: string; altText: string }[] = [];

    for (const file of allFiles) {
      // 4. File size limit verification (5 MB max)
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            error: `File "${file.name}" exceeds the 5MB maximum allowed limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
          },
          { status: 400 }
        );
      }

      // 5. Allowed MIME types and SVG rejection (disallow SVG to prevent Stored XSS)
      const ext = (path.extname(file.name) || "").toLowerCase();
      const mimeType = (file.type || "").toLowerCase();

      if (ext === ".svg" || mimeType === "image/svg+xml") {
        return NextResponse.json(
          { error: "SVG uploads are not permitted for security reasons." },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.has(mimeType) || !ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          {
            error: `Invalid file type for "${file.name}". Only JPG, PNG, WEBP, and AVIF formats are allowed.`,
          },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean filename
      const baseName = path
        .basename(file.name, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "-")
        .toLowerCase()
        .slice(0, 40);
      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const filename = `${baseName || "garment"}-${uniqueSuffix}${ext}`;
      const altText = (baseName || "TN78 Menswear").replace(/[-_]+/g, " ");

      let publicUrl: string;

      if (useSupabaseStorage && supabaseUrl && supabaseServiceKey) {
        publicUrl = await uploadToSupabaseStorage({
          supabaseUrl,
          serviceKey: supabaseServiceKey,
          bucket: storageBucket,
          filename,
          data: bytes,
          contentType: mimeType,
        });
      } else {
        const filePath = path.join(localUploadDir, filename);
        await fs.writeFile(filePath, buffer);
        publicUrl = `/images/products/${filename}`;
      }

      uploadedUrls.push({
        url: publicUrl,
        filename,
        altText,
      });
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: "No valid image files (JPG, PNG, WEBP, AVIF) could be processed." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      count: uploadedUrls.length,
      files: uploadedUrls,
      url: uploadedUrls[0].url,
    });
  } catch (error: unknown) {
    console.error("Image upload failed:", error);
    const message = error instanceof Error ? error.message : "Server error while processing uploaded images.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

