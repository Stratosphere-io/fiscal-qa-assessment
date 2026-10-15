"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { usePageLoading } from "@/components/PageLoading";

type LoadingLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & { href: string };

/** A `Link` that shows the page loading overlay until the linked page has rendered. */
export function LoadingLink({ href, replace, ...linkProps }: LoadingLinkProps) {
  const router = useRouter();
  const { loadPage } = usePageLoading();
  return (
    <Link
      {...linkProps}
      href={href}
      replace={replace}
      onNavigate={(event) => {
        event.preventDefault();
        loadPage(() => (replace ? router.replace(href) : router.push(href)));
      }}
    />
  );
}
