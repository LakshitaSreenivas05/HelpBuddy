import { Metadata } from "next";

import { HelperCard } from "@/components/helpers/helper-card";
import { HelperSearchForm } from "@/components/helpers/helper-search-form";
import { findHelpers } from "@/lib/data/helpers";
import { splitCommaSeparated } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Find Helpers | Help Buddy",
  description:
    "Search and connect with verified helpers near you for technical support, chores, errands, and more.",
};

interface HelpersPageProps {
  searchParams: {
    q?: string;
    location?: string;
    services?: string;
  };
}

export default async function HelpersPage({ searchParams }: HelpersPageProps) {
  const { q, location, services } = searchParams;
  const helpers = await findHelpers({
    query: q,
    location,
    services: splitCommaSeparated(services),
    take: 24,
  });

  const hasFilters = Boolean(q || location || services);

  return (
    <div className="bg-slate-50 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Find a helper
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Browse verified helpers for household projects, tech support, errands, and more.
            Use filters to zero in on the perfect match.
          </p>
        </div>

        <HelperSearchForm />

        <div className="flex flex-col gap-2 rounded-xl bg-white p-4 text-sm text-slate-500 shadow-sm dark:bg-slate-900">
          <div>
            Showing <span className="font-medium text-slate-900 dark:text-slate-100">{helpers.length}</span>{" "}
            {helpers.length === 1 ? "helper" : "helpers"}
            {hasFilters ? " based on your filters." : " available to book now."}
          </div>
          {hasFilters && (
            <div className="text-slate-500 dark:text-slate-400">
              Filters:
              {q && <span className="ml-2">Keyword: <strong>{q}</strong></span>}
              {location && <span className="ml-4">Location: <strong>{location}</strong></span>}
              {services && <span className="ml-4">Skills: <strong>{services}</strong></span>}
            </div>
          )}
        </div>

        {helpers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              No helpers found
            </p>
            <p className="mt-2 text-sm">
              Try broadening your search or removing some filters to see more helpers.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {helpers.map((helper) => (
              <HelperCard key={helper.userId} helper={helper} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

