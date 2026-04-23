import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // 1. Removemos o bg-[#f8f9fa] fixo. Como usamos bg-transparent, 
        // ele vai herdar a cor correta do body (que o next-themes controla)
        <div className="flex bg-transparent font-sans h-screen overflow-hidden">
            <Sidebar />
            
            {/* 2. Trocamos div por main por semântica */}
            {/* 3. Adicionamos pt-16 para não encavalar com o header fixo da Sidebar */}
            <main className="flex-1 flex flex-col overflow-y-auto pt-16 lg:pt-0">
                {children}
            </main>
        </div>
    );
}