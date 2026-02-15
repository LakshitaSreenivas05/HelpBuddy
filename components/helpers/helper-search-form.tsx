"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HelperSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [location, setLocation] = useState(() => searchParams.get("location") ?? "");
  const [services, setServices] = useState(() => searchParams.get("services") ?? "");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }

    if (location.trim()) {
      params.set("location", location.trim());
    } else {
      params.delete("location");
    }

    if (services.trim()) {
      params.set("services", services.trim());
    } else {
      params.delete("services");
    }

    startTransition(() => {
      router.push(`/helpers?${params.toString()}`);
    });
  };

  return (
    <form
      className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[2fr,1.5fr,1.5fr,auto]"
      onSubmit={handleSubmit}
    >
      <Input
        label="Search helpers"
        placeholder="e.g. computer setup, moving help"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Input
        label="Location"
        placeholder="City or neighborhood"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
      />
      <Input
        label="Skills"
        placeholder="Comma separated skills"
        value={services}
        onChange={(event) => setServices(event.target.value)}
      />
      <div className="flex items-end">
        <Button type="submit" className="w-full" loading={isPending}>
          Search
        </Button>
      </div>
    </form>
  );
}

