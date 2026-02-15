import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SerializedHelper } from "@/lib/serializers";
import { formatCurrency } from "@/lib/utils";

interface HelperCardProps {
  helper: SerializedHelper;
  showActions?: boolean;
  className?: string;
}

export function HelperCard({
  helper,
  showActions = true,
  className,
}: HelperCardProps) {
  const displayName =
    helper.user.profile?.displayName ??
    helper.user.name ??
    "Help Buddy Helper";

  return (
    <Card className={className}>
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              size="md"
              src={helper.user.profile?.avatarUrl ?? undefined}
              alt={displayName}
            />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {displayName}
                </p>
                {helper.isVerified && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {helper.headline ?? "Trusted helper"}
              </p>
            </div>
          </div>
          <div className="text-right text-sm text-slate-500 dark:text-slate-400">
            <div className="font-semibold text-slate-900 dark:text-white">
              {helper.ratingCount > 0
                ? `${helper.averageRating.toFixed(1)}`
                : "New"}
            </div>
            <div>{helper.ratingCount > 0 ? `${helper.ratingCount} reviews` : "Awaiting reviews"}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {helper.services.length === 0 ? (
            <Badge variant="outline">Flexible helper</Badge>
          ) : (
            helper.services.slice(0, 4).map((service) => (
              <Badge key={service} variant="outline">
                {service}
              </Badge>
            ))
          )}
          {helper.services.length > 4 && (
            <Badge variant="outline">
              +{helper.services.length - 4} more
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center justify-between">
            <span>Location</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {helper.user.profile?.location ?? "Remote"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Hourly rate</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {helper.hourlyRate
                ? formatCurrency(helper.hourlyRate)
                : "Custom quote"}
            </span>
          </div>
          {helper.yearsOfExperience !== null && (
            <div className="flex items-center justify-between">
              <span>Experience</span>
              <span>{helper.yearsOfExperience} yrs</span>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href={`/helpers/${helper.userId}`} className="flex-1">
              <Button className="w-full" variant="secondary">
                View profile
              </Button>
            </Link>
            <Link href={`/helpers/${helper.userId}#book`} className="flex-1">
              <Button className="w-full">Book now</Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}

