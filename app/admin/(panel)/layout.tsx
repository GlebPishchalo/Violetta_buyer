import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

type PanelLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminPanelLayout({ children }: PanelLayoutProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.adminId) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-ink-soft">
      <AdminSidebar />
      <div className="pl-60">
        <AdminTopbar />
        <div className="mx-auto max-w-[1200px] p-8">{children}</div>
      </div>
    </div>
  );
}
