import { redirect } from "next/navigation";

export default function TrendingPage() {
  redirect("/shop?sort=featured");
}
