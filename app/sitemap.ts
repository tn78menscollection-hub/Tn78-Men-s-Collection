import { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/mockHomepageData";
import { getProducts } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://tn78menswear.com").replace(/\/+$/, "");

  // Core static storefront routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/style-your-fit`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/category/${cat.id}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Curated editorial collection routes
  const collectionRoutes: MetadataRoute.Sitemap = [
    "summer-linen",
    "urban-comfort",
    "resort-evening",
  ].map((slug) => ({
    url: `${baseUrl}/collections/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Dynamic product routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const productsRes = await getProducts({ page_size: 100 });
    if (productsRes && productsRes.items) {
      productRoutes = productsRes.items.map((prod) => ({
        url: `${baseUrl}/product/${prod.slug}`,
        lastModified: prod.created_at ? new Date(prod.created_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch (err) {
    // If backend is unavailable during build, proceed with static and category routes
  }

  return [...staticRoutes, ...categoryRoutes, ...collectionRoutes, ...productRoutes];
}
