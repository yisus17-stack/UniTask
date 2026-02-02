import type { ReactNode } from "react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import Encabezado from "@/components/diseño/encabezado";
import NavegacionPrincipal from "@/components/diseño/navegacion-principal";

export default function TableroLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <NavegacionPrincipal />
        </Sidebar>
        <SidebarInset className="flex flex-1 flex-col">
          <Encabezado />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
