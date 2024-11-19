"use client"

import * as React from "react"
import {
  CircleEllipsis,
  BookText,
  Globe,
  AppWindow,
  Wallet,
  SquareTerminal,
} from "lucide-react"
import { useTranslations } from 'next-intl'
import Image from "next/image"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations('Navigation')

  const data = {
    user: {
      name: t('appTitle'),
      email: "m@example.com",
      avatar: "",
    },
    navMain: [
      {
        title: t('navMain.addressGenerator'),
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [],
      },
      {
        title: t('navMain.more'),
        url: "#",
        icon: CircleEllipsis,
        items: [],
      },
    ],
    navSecondary: [],  
    projects: [
      {
        name: t('projects.website'),
        url: "https://qubic.org/",
        icon: Globe,
      },
      {
        name: t('projects.docs'),
        url: "https://docs.qubic.org/",
        icon: BookText,
      },
      {
        name: t('projects.wallet'),
        url: "https://wallet.qubic.org/",
        icon: Wallet,
      },
      {
        name: t('projects.explorer'),
        url: "https://explorer.qubic.org/",
        icon: AppWindow,
      },
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <Image
                  className="h-8 w-8"
                  width={32}
                  height={32}
                  src={`${process.env.NODE_ENV === 'production' ? '/qubic-vanity' : ''}/img/logo.png`}
                  alt="Logo"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{t('appTitle')}</span>
                  <span className="truncate text-xs">{t('appSubtitle')}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
