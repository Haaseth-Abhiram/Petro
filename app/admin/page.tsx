import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-session";

export default async function AdminRootPage() {
  const admin = await getCurrentAdmin();
  if (admin) {
    redirect("/admin/dashboard");
  } else {
    redirect("/login");
  }
}
