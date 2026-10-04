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
      <div className="pt-[112px] md:pl-60 md:pt-0">
        <AdminTopbar />
        <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-5 sm:px-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
