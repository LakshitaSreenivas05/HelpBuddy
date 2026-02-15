import Link from "next/link";

const footerLinks = [
  { href: "/helpers", label: "Find Helpers" },
  { href: "/register", label: "Become a Helper" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 text-center text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            Help Buddy
          </p>
          <p className="mt-1 max-w-md">
            Connecting people who need a hand with trusted helpers in their community.
          </p>
        </div>
        <nav className="flex items-center justify-center gap-4">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-slate-900 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p>© {new Date().getFullYear()} Help Buddy. All rights reserved.</p>
      </div>
    </footer>
  );
}

