import { Metadata } from "next";
import { notFound } from "next/navigation";

import { CreateBookingForm } from "@/components/bookings/create-booking-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { prisma } from "@/lib/prisma";
import {
  helperInclude,
  reviewInclude,
  serializeHelper,
  type SerializedHelper,
  type ReviewWithReviewer,
} from "@/lib/serializers";
import { formatDateTime } from "@/lib/utils";

interface HelperPageProps {
  params: Promise<{ id: string }>;
}

async function getHelper(id: string): Promise<SerializedHelper | null> {
  const helper = await prisma.helperProfile.findFirst({
    where: {
      OR: [{ userId: id }, { id }],
    },
    include: helperInclude,
  });

  if (!helper) {
    return null;
  }

  const reviews = await prisma.review.findMany({
    where: { helperId: helper.userId },
    include: reviewInclude,
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return serializeHelper(helper, reviews as ReviewWithReviewer[]);
}

export async function generateMetadata({
  params,
}: HelperPageProps): Promise<Metadata> {
  const { id } = await params;

  if (!id) {
    return {
      title: "Helper not found | Help Buddy",
    };
  }

  const helper = await getHelper(id);
  if (!helper) {
    return {
      title: "Helper not found | Help Buddy",
    };
  }

  const name =
    helper.user.profile?.displayName ?? helper.user.name ?? "Help Buddy Helper";
  const headline = helper.headline ?? "Trusted helper on Help Buddy";

  return {
    title: `${name} | Help Buddy`,
    description: `${headline} — book this helper for ${helper.services
      .slice(0, 3)
      .join(", ")} and more.`,
  };
}

export default async function HelperDetailPage({ params }: HelperPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const helper = await getHelper(id);

  if (!helper) {
    notFound();
  }

  const displayName =
    helper.user.profile?.displayName ?? helper.user.name ?? "Help Buddy Helper";
  type AvailabilityEntry = { day?: string; slots?: string | string[] };
  const availabilityEntries: AvailabilityEntry[] | null = Array.isArray(
    helper.availability
  )
    ? (helper.availability as AvailabilityEntry[])
    : null;

  return (
    <div className="bg-slate-50 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-8">
            <Card className="p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <Avatar
                  size="lg"
                  src={helper.user.profile?.avatarUrl ?? undefined}
                  alt={displayName}
                />
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
                      {displayName}
                    </h1>
                    {helper.isVerified && (
                      <Badge variant="success">Verified helper</Badge>
                    )}
                  </div>
                  <p className="text-lg text-slate-600 dark:text-slate-300">
                    {helper.headline ?? "Helping neighbors get things done"}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
                    <span>
                      Rating:{" "}
                      <strong className="text-slate-900 dark:text-slate-100">
                        {helper.ratingCount > 0
                          ? `${helper.averageRating.toFixed(1)} (${
                              helper.ratingCount
                            } reviews)`
                          : "New helper"}
                      </strong>
                    </span>
                    {helper.hourlyRate && (
                      <span>
                        Hourly rate:{" "}
                        <strong>${helper.hourlyRate.toFixed(2)}</strong>
                      </span>
                    )}
                    {helper.user.profile?.location && (
                      <span>Based in {helper.user.profile.location}</span>
                    )}
                    {helper.yearsOfExperience !== null && (
                      <span>{helper.yearsOfExperience} years experience</span>
                    )}
                  </div>
                  {helper.services.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {helper.services.map((service: string) => (
                        <Badge key={service} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {(helper.user.profile?.bio || helper.headline) && (
              <Card>
                <CardHeader>
                  <CardTitle>About {displayName}</CardTitle>
                  <CardDescription>
                    {helper.user.profile?.bio ??
                      helper.headline ??
                      "Dedicated helper ready to tackle your next task."}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {availabilityEntries && (
              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                  <CardDescription>
                    The schedule below reflects typical availability. Exact
                    times will be confirmed after booking.
                  </CardDescription>
                </CardHeader>
                <div className="space-y-3 px-6 pb-6">
                  {availabilityEntries.length > 0 ? (
                    availabilityEntries.map((slot, index) => (
                      <div
                        key={`${slot.day ?? "flexible"}-${index}`}
                        className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {slot.day ?? "Flexible"}
                        </span>
                        <span>
                          {Array.isArray(slot.slots)
                            ? slot.slots.join(", ")
                            : slot.slots ?? "By request"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Availability provided during booking.
                    </p>
                  )}
                </div>
              </Card>
            )}

            <section id="reviews" className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Recent reviews
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Feedback from clients is shown below to help you get to know
                  this helper.
                </p>
              </div>
              {helper.reviews && helper.reviews.length > 0 ? (
                <div className="space-y-4">
                  {helper.reviews.map((review: ReviewWithReviewer) => (
                    <Card key={review.id} className="p-5">
                      <div className="flex items-start gap-4">
                        <Avatar
                          size="sm"
                          src={review.reviewer?.profile?.avatarUrl ?? undefined}
                          alt={
                            review.reviewer?.profile?.displayName ??
                            review.reviewer?.name ??
                            "Requester"
                          }
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {review.reviewer?.profile?.displayName ??
                                review.reviewer?.name ??
                                "Requester"}
                            </span>
                            <span>•</span>
                            <span>{formatDateTime(review.createdAt)}</span>
                            <span>•</span>
                            <span>{review.rating}/5</span>
                          </div>
                          {review.comment ? (
                            <p className="text-sm text-slate-700 dark:text-slate-200">
                              {review.comment}
                            </p>
                          ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              No comment provided.
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-sm text-slate-500 dark:text-slate-400">
                  Be the first to work with {displayName} and leave a review.
                </Card>
              )}
            </section>
          </div>

          <div id="book" className="space-y-6">
            <CreateBookingForm
              helperId={helper.userId}
              helperName={displayName}
            />
            <Card className="space-y-3 p-6">
              <CardTitle className="text-lg">
                Why book through Help Buddy?
              </CardTitle>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>• Secure messaging and scheduling in one place.</li>
                <li>• Verified helpers with community-backed reviews.</li>
                <li>• Centralized booking history for easy follow-up.</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
