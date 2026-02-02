"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ListTodo, UserCircle } from "lucide-react";
import { SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Logo from "@/components/diseño/logo";

const menuItems = [
  { href: "/tablero/horario", label: "Horario", icon: Calendar },
  { href: "/tablero/tareas", label: "Tareas", icon: ListTodo },
  { href: "/tablero/perfil", label: "Perfil", icon: UserCircle },
];

export default function NavegacionPrincipal() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href="/tablero/horario">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                className="justify-start"
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
