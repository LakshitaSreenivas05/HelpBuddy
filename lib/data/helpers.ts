import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  helperInclude,
  serializeHelper,
  type SerializedHelper,
} from "@/lib/serializers";

export interface HelperSearchParams {
  query?: string | null;
  location?: string | null;
  services?: string[] | null;
  skip?: number;
  take?: number;
  verifiedOnly?: boolean;
}

export async function findHelpers({
  query,
  location,
  services,
  skip = 0,
  take = 20,
  verifiedOnly = false,
}: HelperSearchParams): Promise<SerializedHelper[]> {
  const where: Parameters<typeof prisma.helperProfile.findMany>[0]["where"] = {
    user: {
      role: UserRole.HELPER,
    },
  };

  if (verifiedOnly) {
    where.isVerified = true;
  }

  if (query?.trim()) {
    const keywords = query.split(/\s+/).filter(Boolean);
    where.OR = [
      {
        headline: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        services: {
          hasSome: keywords,
        },
      },
      {
        user: {
          profile: {
            displayName: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  if (location?.trim()) {
    where.user = {
      ...(where.user ?? {}),
      profile: {
        location: {
          contains: location,
          mode: "insensitive",
        },
      },
    };
  }

  if (services?.length) {
    where.services = { hasSome: services };
  }

  const helpers = await prisma.helperProfile.findMany({
    where,
    include: helperInclude,
    orderBy: [
      { isVerified: "desc" },
      { averageRating: "desc" },
      { ratingCount: "desc" },
      { createdAt: "desc" },
    ],
    skip,
    take: Math.min(take, 50),
  });

  return helpers.map(serializeHelper);
}

