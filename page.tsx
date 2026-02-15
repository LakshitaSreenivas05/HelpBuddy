import Link from "next/link";
import { ArrowRight, CalendarCheck2, Search, ShieldCheck } from "lucide-react";

import { HelperCard } from "@/components/helpers/helper-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { helperInclude, serializeHelper } from "@/lib/serializers";

const features = [
  {
    title: "Verified Helpers",
    description:
      "Every helper on Help Buddy passes a verification checklist to ensure safety and quality.",
    icon: ShieldCheck,
  },
  {
    title: "Smart Matching",
    description:
      "Search helpers by skills, availability, or location to find the right fit for any job.",
    icon: Search,
  },
  {
    title: "Booking & Tracking",
    description:
      "Book in minutes, stay updated on progress, and keep your history in one place.",
    icon: CalendarCheck2,
  },
];

const steps = [
  {
    title: "Tell us what you need",
    description: "Describe your task, preferred schedule, and location.",
  },
  {
    title: "Browse verified helpers",
    description: "Compare profiles, ratings, hourly rates, and specialties.",
  },
  {
    title: "Book and stay connected",
    description:
      "Confirm a time, chat with your helper, and track the booking through completion.",
  },
];

const stats = [
  { label: "Tasks completed", value: "18k+" },
  { label: "Verified helpers", value: "2.4k" },
  { label: "Average rating", value: "4.9 / 5" },
];

async function getFeaturedHelpers() {
  const helpers = await prisma.helperProfile.findMany({
    where: {
      isVerified: true,
    },
    include: helperInclude,
    orderBy: [
      { averageRating: "desc" },
      { ratingCount: "desc" },
      { createdAt: "desc" },
    ],
    take: 6,
  });

  return helpers.map(serializeHelper);
}

export default async function Home() {
  const helpers = await getFeaturedHelpers();

  return (
    <div className="bg-linear-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-950">
      <section className="relative overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 md:flex-row md:items-center md:py-24 lg:px-8">
          <div className="flex-1 space-y-8">
            <Badge className="w-fit" variant="outline">
              Trusted by helpers across 120+ cities
            </Badge>
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
                Find reliable help, when and where you need it.
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                Help Buddy connects people who need assistance with trusted
                helpers for technical support, home projects, errands, and more.
                Every helper is vetted so you can book with confidence.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/helpers">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse helpers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Become a helper
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 md:flex-row">
              {stats.map((stat) => (
                <div key={stat.label} className="flex-1 space-y-1">
                  <p className="text-3xl font-semibold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="space-y-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  Featured Task
                </p>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  Home network troubleshooting
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  “Our helper diagnosed and fixed a tricky Wi-Fi issue in 45
                  minutes. Super professional and friendly.”
                </p>
                <div className="rounded-2xl bg-slate-100/70 p-4 dark:bg-slate-800/70">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    How it works
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <Search className="mt-0.5 h-4 w-4 text-blue-500" />
                      Request help with your task
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-500" />
                      Pick a verified specialist
                    </li>
                    <li className="flex items-start gap-2">
                      <CalendarCheck2 className="mt-0.5 h-4 w-4 text-blue-500" />
                      Schedule and track progress
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Why people choose Help Buddy
            </h2>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
              From tech setups to daily errands, our marketplace makes it easy
              to find the right person for any job.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader className="space-y-4">
                  <feature.icon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  <div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.2fr,1fr]">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
                Book a helper in minutes
              </h2>
              <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
                Help Buddy streamlines every step. Here’s what your journey
                looks like.
              </p>
              <div className="mt-8 space-y-6">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="bg-linear-to-br from-blue-600 via-blue-500 to-indigo-500 text-white shadow-xl">
              <CardHeader className="space-y-3">
                <CardTitle className="text-white">
                  Need a hand right away?
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Sign in to view helpers available in your area and chat
                  instantly.
                </CardDescription>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-blue-600 hover:bg-slate-100"
                  >
                    Sign in to get started
                  </Button>
                </Link>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
                Featured helpers near you
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Explore top-rated helpers based on reviews and responsiveness.
              </p>
            </div>
            <Link
              href="/helpers"
              className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block"
            >
              View all helpers →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {helpers.length === 0 ? (
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>No helpers yet</CardTitle>
                  <CardDescription>
                    Once helpers join the platform, you will see them here.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              helpers.map((helper: any) => (
                <HelperCard key={helper.userId} helper={helper} />
              ))
            )}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/helpers"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all helpers →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
