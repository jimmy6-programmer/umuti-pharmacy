import { Providers } from "@/lib/providers";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <DashboardSidebar />
        <main className="lg:pl-64">
          <div className="p-4 pt-14 lg:pt-6 lg:p-8">{children}</div>
        </main>
      </div>
      <Toaster />
    </Providers>
  );
}
