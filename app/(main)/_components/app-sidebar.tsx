"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import {
  Clock,
  CreditCard,
  Images,
  LayoutDashboard,
  Palette,
  Sparkles,
  Video,
  Waypoints,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export function AppSidebar() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-3 select-none cursor-pointer" onClick={()=> router.push("/dashboard")}>
               <Image
                 src={resolvedTheme === "dark" ? "/dark_logo.svg" : "/light_logo.svg"}
                 alt="Zentro Logo"
                 width={24}
                 height={24}
                 className="w-6 h-6"
               />
               <span className="text-xl font-bold tracking-wide text-zinc-900 dark:text-white drop-shadow-sm">
                 Zentro
               </span>
             </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {(() => {
              const pathname = usePathname();
              return (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard"}
                    >
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/youtube-channel-guide"}
                    >
                      <Link href="/youtube-channel-guide">
                        <Waypoints className="mr-2" />
                        <span>YouTube Channel Guide</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/youtube"}
                    >
                      <Link href="/youtube">
                        <Sparkles className="mr-2" />
                        <span>YouTube</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/videos"}
                    >
                      <Link href="/videos">
                        <Video className="mr-2" />
                        <span>Videos</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/my-videos"}
                    >
                      <Link href="/my-videos">
                        <Youtube className="mr-2" />
                        <span>My Videos</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/my-thumbnails"}
                    >
                      <Link href="/my-thumbnails">
                        <Images className="mr-2" />
                        <span>My Thumbnails</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/my-logos"}
                    >
                      <Link href="/my-logos">
                        <Palette className="mr-2" />
                        <span>My Logos</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/thumbnail-generator"}
                    >
                      <Link href="/thumbnail-generator">
                        <Images className="mr-2" />
                        <span>Thumbnail Generator</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/logo-generator"}
                    >
                      <Link href="/logo-generator">
                        <Palette className="mr-2" />
                        <span>Logo Generator</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/smart-upload-scheduler"}
                    >
                      <Link href="/smart-upload-scheduler">
                        <Clock className="mr-2" />
                        <span>Smart Upload Scheduler</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/billing"}>
                      <Link href="/billing">
                        <CreditCard className="mr-2" />
                        <span>Billing</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              );
            })()}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
