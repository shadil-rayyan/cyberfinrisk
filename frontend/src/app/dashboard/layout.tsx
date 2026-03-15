import Sidebar from "@/components/dashboard/Sidebar";
import { OrgProvider } from "@/context/OrgContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <OrgProvider>
            <div className="flex h-screen overflow-hidden" style={{ background: "var(--background)" }}>
                <Sidebar />
                <main className="flex-1 flex flex-col overflow-y-auto">
                    {children}
                </main>
            </div>
        </OrgProvider>
    );
}


