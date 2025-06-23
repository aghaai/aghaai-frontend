"use client";
import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sideBarLinks } from "./constant";
import { ChevronRight } from "lucide-react";
import { Label } from "../ui/label";
import { UpgradePlan } from "./upgrade-plan";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const firstIndex = usePathname()?.split("/")[1] || "/";
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-center gap-2">
            <Link href="/" className="font-semibold text-xl">
              Aghaai
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-2">
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                {sideBarLinks.map((item) =>
                  item.type === "routed" ? (
                    <SidebarMenuSubItem key={item.title} className="">
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={item.slug == firstIndex}
                        className="h-9"
                      >
                        <Link
                          href={item.url}
                          className="flex w-full items-center gap-2"
                        >
                          {item.icon && <item.icon className="w-4 h-4" />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  ) : item.type === "dropdown" ? (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={item.slug == firstIndex}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            className="h-9"
                          >
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="gap-2">
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  //   isActive={subItem.slug == lastIndex}
                                >
                                  <Link href={subItem.url}>
                                    <>
                                      {subItem.icon && (
                                        <subItem.icon className="w-4 h-4" />
                                      )}

                                      <span>{subItem.title}</span>
                                    </>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <Label
                      key={item.title}
                      className="py-3 text-muted-foreground"
                    >
                      {item.title}
                    </Label>
                  )
                )}
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UpgradePlan/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
