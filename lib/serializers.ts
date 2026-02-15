import type { Prisma } from "@prisma/client";

export const bookingInclude = {
  helper: {
    select: {
      id: true,
      name: true,
      profile: true,
      helperProfile: true,
    },
  },
  requester: {
    select: {
      id: true,
      name: true,
      profile: true,
    },
  },
  review: true,
} satisfies Prisma.BookingInclude;

export type BookingWithRelations = Prisma.BookingGetPayload<{
  include: typeof bookingInclude;
}>;

export const serializeBooking = (booking: BookingWithRelations | null) => {
  if (!booking) return null;

  return {
    ...booking,
    price: booking.price ? Number(booking.price) : null,
    helper: booking.helper
      ? {
          ...booking.helper,
          helperProfile: booking.helper.helperProfile
            ? {
                ...booking.helper.helperProfile,
                hourlyRate: booking.helper.helperProfile.hourlyRate
                  ? Number(booking.helper.helperProfile.hourlyRate)
                  : null,
              }
            : null,
        }
      : null,
    requester: booking.requester ? { ...booking.requester } : null,
  };
};

export const helperInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      profile: true,
    },
  },
} satisfies Prisma.HelperProfileInclude;

export const reviewInclude = {
  reviewer: {
    select: {
      id: true,
      name: true,
      profile: {
        select: {
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  },
} satisfies Prisma.ReviewInclude;

type HelperBase = Prisma.HelperProfileGetPayload<{
  include: typeof helperInclude;
}>;

export type ReviewWithReviewer = Prisma.ReviewGetPayload<{
  include: typeof reviewInclude;
}>;

export const serializeHelper = (
  helper: HelperBase,
  reviews: ReviewWithReviewer[] = [],
) => ({
  ...helper,
  hourlyRate: helper.hourlyRate ? Number(helper.hourlyRate) : null,
  user: helper.user,
  reviews,
});

export type SerializedHelper = ReturnType<typeof serializeHelper>;
export type SerializedBooking = NonNullable<ReturnType<typeof serializeBooking>>;

