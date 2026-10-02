"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredAuthToken } from "@/lib/api";

export default function AccountIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getStoredAuthToken();
    if (token) {
      router.replace("/account/orders");
    } else {
      router.replace("/account/login");
    }
  }, [router]);

  return (
    <div className="bg-[#0A0B0E] min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#E2C58A] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
