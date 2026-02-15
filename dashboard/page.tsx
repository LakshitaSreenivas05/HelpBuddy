import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarCheck2, Clock, Star, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  bookingInclude,
  serializeBooking,
  type BookingWithRelations,
} from "@/lib/serializers";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const isHelper = session.user.role === "HELPER";

  const [user, bookings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        helperProfile: true,
      },
    }),
    prisma.booking.findMany({
      where: isHelper
        ? { helperId: session.user.id }
        : { requesterId: session.user.id },
      include: bookingInclude,
      orderBy: [
        { status: "asc" },
        { scheduledAt: "asc" },
      ],
      take: 5,
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  const serializedBookings = bookings.map((booking) =>
    serializeBooking(booking as BookingWithRelations),
  );

  const upcomingBookings = serializedBookings.filter(
    (booking) =>
      booking.status === "PENDING" || booking.status === "CONFIRMED",
  );

  const completedBookings = serializedBookings.filter(
    (booking) => booking.status === "COMPLETED",
  );

  const stats = [
    {
      label: "Upcoming",
      value: upcomingBookings.length,
      icon: CalendarCheck2,
      description: isHelper
        ? "Requests awaiting confirmation"
        : "Bookings scheduled",
    },
    {
      label: "Completed",
      value: completedBookings.length,
      icon: Clock,
      description: "Finished tasks through Help Buddy",
    },
    {
      label: "Average rating",
      value: user.helperProfile?.ratingCount
        ? `${user.helperProfile.averageRating.toFixed(1)}`
        : "N/A",
      icon: Star,
      description: isHelper
        ? `${user.helperProfile?.ratingCount ?? 0} reviews`
        : "Review your helpers after completion",
    },
    {
      label: isHelper ? "Clients helped" : "Helpers booked",
      value: isHelper
        ? new Set(serializedBookings.map((booking) => booking.requester?.id)).size
        : new Set(serializedBookings.map((booking) => booking.helper?.id)).size,
      icon: Users,
      description: isHelper
        ? "Unique clients you’ve supported"
        : "Helpers you’ve worked with",
    },
  ];

  return (
    <div className="bg-slate-50 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Welcome back,{" "}
            {user.profile?.displayName ?? user.name ?? "Help Buddy member"}.
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            {isHelper
              ? "Manage your upcoming bookings, update your availability, and respond to new requests."
              : "Track your bookings, review helpers, and manage your requests from here."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                    {stat.value ?? 0}
                  </p>
                </div>
                <stat.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                {stat.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
          <Card className="p-6">
            <CardHeader className="px-0">
              <CardTitle>Recent bookings</CardTitle>
              <CardDescription>
                {isHelper
                  ? "Review new requests and confirm upcoming appointments."
                  : "Stay on top of your recent booking activity."}
              </CardDescription>
            </CardHeader>
            <div className="space-y-4">
              {serializedBookings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {isHelper
                    ? "You have no bookings yet. Update your profile to attract clients."
                    : "No bookings yet. Browse helpers to get started."}
                </div>
              ) : (
                serializedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-800 dark:hover:border-blue-500/40 dark:hover:bg-blue-950/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        {booking.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDateTime(booking.scheduledAt)} •{" "}
                        {isHelper
                          ? `Requester: ${booking.requester?.profile?.displayName ?? booking.requester?.name ?? "Unknown"}`
                          : `Helper: ${booking.helper?.profile?.displayName ?? booking.helper?.name ?? "Unknown"}`}
                      </p>
                      {booking.price && (
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Estimated value: {formatCurrency(booking.price)}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={
                        booking.status === "CONFIRMED"
                          ? "success"
                          : booking.status === "PENDING"
                            ? "default"
                            : booking.status === "COMPLETED"
                              ? "outline"
                              : "warning"
                      }
                      className="w-fit"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 text-right text-sm">
              <Link
                href="/dashboard/bookings"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                View all bookings →
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <CardHeader className="px-0">
              <CardTitle>Complete your profile</CardTitle>
              <CardDescription>
                Keep your profile updated so helpers know how to reach you, and clients can see your specialties.
              </CardDescription>
            </CardHeader>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>
                <strong>Role:</strong> {session.user.role.toLowerCase()}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {user.profile?.location ?? "Add your location"}
              </p>
              {isHelper && (
                <p>
                  <strong>Services offered:</strong>{" "}
                  {user.helperProfile?.services.length
                    ? user.helperProfile.services.join(", ")
                    : "Update your services to attract the right clients."}
                </p>
              )}
            </div>
            <Link href="/dashboard/profile">
              <Card className="mt-4 cursor-pointer border-dashed border-blue-200 bg-blue-50/60 p-4 text-sm text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-400/40 dark:bg-blue-950/40 dark:text-blue-200">
                Go to profile settings →
              </Card>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

