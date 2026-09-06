"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Dashboard",
    href: "/customer",
  },
  {
    label: "Orders",
    href: "/customer/orders",
  },
  {
    label: "Custom Requests",
    href: "/customer/requests",
  },
  {
    label: "Profile",
    href: "/customer/profile",
  },
  {
    label: "Addresses",
    href: "/customer/addresses",
  },
];

export default function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-3xl border border-border bg-card/40 p-4 backdrop-blur">
      <nav className="space-y-1">
        {navigation.map((item) => {
          const active =
            item.href === "/customer"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`body-font block rounded-2xl px-4 py-3 text-sm transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="my-4 border-t border-border" />

      <button
        type="button"
        className="body-font w-full rounded-2xl px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        Logout
      </button>
    </aside>
  );
}