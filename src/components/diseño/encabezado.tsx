"use client";

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Encabezado() {
  const pathname = usePathname();
  const router = useRouter();
  const avatarImage = PlaceHolderImages.find(img => img.id === 'user-avatar');

  const getPageTitle = () => {
    if (pathname.includes('/horario')) return 'Horario Semanal';
    if (pathname.includes('/tareas')) return 'Gestión de Tareas';
    if (pathname.includes('/perfil')) return 'Perfil de Usuario';
    return 'Tablero';
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-semibold font-headline">{getPageTitle()}</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              {avatarImage && <AvatarImage src={avatarImage.imageUrl} data-ai-hint={avatarImage.imageHint} />}
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>
            <p>Ana Ureña</p>
            <p className="text-xs font-normal text-muted-foreground">ana.urena@example.com</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/tablero/perfil">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/ingreso')}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
