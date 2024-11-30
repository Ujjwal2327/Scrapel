"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function BreadcrumbHeader() {
  const pathname = usePathname();
  const paths = pathname === "/" ? [""] : pathname.split("/");

  const buildUrl = (paths, index) => paths.slice(0, index + 1).join("/") || "/";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => (
          <React.Fragment key={path + index}>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={buildUrl(paths, index)}
                className="capitalize"
              >
                {path === "" ? "Home" : path}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index !== paths.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
