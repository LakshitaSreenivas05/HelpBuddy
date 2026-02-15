import Link from "next/link";
import { redirect } from "next/navigation";

import { BookingActions } from "@/components/bookings/booking-actions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  bookingInclude,
  serializeBooking,
  type BookingWithRelations,
  type SerializedBooking,
} from "@/lib/serializers";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

function groupByStatus(bookings: SerializedBooking[]) {
  return bookings.reduce<Record<string, SerializedBooking[]>>((acc, booking) => {
    const key = booking.status;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(booking);
    return acc;
  }, {});
}

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const isHelper = session.user.role === "HELPER";

  const bookings = await prisma.booking.findMany({
    where: isHelper
      ? { helperId: session.user.id }
      : { requesterId: session.user.id },
    include: bookingInclude,
    orderBy: [
      { status: "asc" },
      { scheduledAt: "desc" },
    ],
  });

  const serializedBookings = bookings.map((booking) =>
    serializeBooking(booking as BookingWithRelations),
  ) as SerializedBooking[];

  const grouped = groupByStatus(serializedBookings);
  const statusOrder = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "DECLINED"];

  return (
    <div className="bg-slate-50 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Your bookings
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              {isHelper
                ? "Manage your incoming requests and confirm availability."
                : "Track the status of your helper bookings and leave reviews."}
            </p>
          </div>
          {!isHelper && (
            <Link
              href="/helpers"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Find more helpers →
            </Link>
          )}
        </div>

        {serializedBookings.length === 0 ? (
          <Card className="p-10 text-center text-slate-500 dark:text-slate-400">
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              No bookings yet
            </p>
            <p className="mt-2 text-sm">
              {isHelper
                ? "When requesters book you, your schedule will appear here."
                : "Browse helpers to create your first booking."}
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {statusOrder
              .filter((status) => grouped[status]?.length)
              .map((status) => (
                <section key={status} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </h2>
                    <Badge variant="outline">
                      {grouped[status].length}{" "}
                      {grouped[status].length === 1 ? "booking" : "bookings"}
                    </Badge>
                  </div>
                  <div className="grid gap-4">
                    {grouped[status].map((booking) => (
                      <Card key={booking.id} className="space-y-4 p-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {booking.title}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {formatDateTime(booking.scheduledAt)} •{" "}
                              {booking.durationMinutes
                                ? `${booking.durationMinutes} min`
                                : "Flexible duration"}
                            </p>
                          </div>
                          <Badge>
                            {isHelper
                              ? `Requester: ${
                                  booking.requester?.profile?.displayName ??
                                  booking.requester?.name ??
                                  "Unknown"
                                }`
                              : `Helper: ${
                                  booking.helper?.profile?.displayName ??
                                  booking.helper?.name ??
                                  "Unknown"
                                }`}
                          </Badge>
                        </div>
                        {booking.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {booking.description}
                          </p>
                        )}
                        <div className="grid gap-4 sm:grid-cols-3 sm:items-start">
                          <div className="space-y-1 text-sm text-slate-500 dark:text-slate-300">
                            <p>
                              <strong>Location:</strong>{" "}
                              {booking.location ?? "To be decided"}
                            </p>
                            <p>
                              <strong>Budget:</strong>{" "}
                              {booking.price
                                ? formatCurrency(booking.price)
                                : "Not specified"}
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <BookingActions booking={booking} role={session.user.role} />
                          </div>
                        </div>
                        {booking.review && (
                          <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                            <p className="font-medium">
                              Your review: {booking.review.rating}/5
                            </p>
                            {booking.review.comment && <p>{booking.review.comment}</p>}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

