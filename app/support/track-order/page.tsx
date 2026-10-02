import { redirect } from "next/navigation";

export default function SupportTrackOrderRedirect() {
  redirect("/orders/track");
}
