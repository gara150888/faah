"use client";
import React, { Fragment } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

import { AppSidebar } from "~/components/sidebar/app-sidebar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import ToolTipWrapper from "~/components/ui/ToolTipWrapper";
import { ChevronLeftIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "better-auth";

export default function Sidebar({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const pathname = usePathname()
    .split("/")
    .filter((r) => r);
  const router = useRouter();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-sidebar-border">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {pathname.map((r, index) => {
                  const isLast = index === pathname.length - 1;
                  const href = "/" + pathname.slice(0, index + 1).join("/");
                  return (
                    <Fragment key={index}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="capitalize">
                            {r.replaceAll("-", " ")}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            render={<Link prefetch={true} href={href} />}
                            className="capitalize"
                          >
                            {r.replaceAll("-", " ")}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center">
              <ToolTipWrapper content="Back">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                >
                  <ChevronLeftIcon size={20} />
                </Button>
              </ToolTipWrapper>
            </div>
          </div>
        </header>
        <div className="bg-background flex flex-1 flex-col gap-4 p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
