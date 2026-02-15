"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { SerializedBooking } from "@/lib/serializers";

interface BookingActionsProps {
  booking: SerializedBooking;
  role: "HELPER" | "REQUESTER" | "ADMIN";
}

export function BookingActions({ booking, role }: BookingActionsProps) {
  const router = useRouter();
  const effectiveRole = role === "ADMIN" ? "HELPER" : role;
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewComment, setReviewComment] = useState("");

  const updateStatus = async (status: "CONFIRMED" | "DECLINED" | "COMPLETED" | "CANCELLED") => {
    setError(null);
    setLoading(status);
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(
          typeof payload.error === "string"
            ? payload.error
            : "Unable to update booking status.",
        );
      }
      router.refresh();
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(null);
    }
  };

  const submitReview = async () => {
    setError(null);
    setLoading("REVIEW");
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.id,
          rating: Number(reviewRating),
          comment: reviewComment,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(
          typeof payload.error === "string"
            ? payload.error
            : "Unable to submit review. Please try again.",
        );
      }

      setShowReview(false);
      setReviewComment("");
      setReviewRating("5");
      router.refresh();
    } catch (reviewError) {
      setError(
        reviewError instanceof Error
          ? reviewError.message
          : "Could not submit review.",
      );
    } finally {
      setLoading(null);
    }
  };

  const canLeaveReview =
    effectiveRole === "REQUESTER" &&
    booking.status === "COMPLETED" &&
    !booking.review;

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-200">
          {error}
        </div>
      )}

      {effectiveRole === "HELPER" && booking.status === "PENDING" && (
        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            onClick={() => updateStatus("CONFIRMED")}
            loading={loading === "CONFIRMED"}
          >
            Confirm booking
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateStatus("DECLINED")}
            loading={loading === "DECLINED"}
          >
            Decline
          </Button>
        </div>
      )}

      {effectiveRole === "HELPER" && booking.status === "CONFIRMED" && (
        <Button
          size="sm"
          onClick={() => updateStatus("COMPLETED")}
          loading={loading === "COMPLETED"}
        >
          Mark as completed
        </Button>
      )}

      {effectiveRole === "REQUESTER" &&
        (booking.status === "PENDING" || booking.status === "CONFIRMED") && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateStatus("CANCELLED")}
            loading={loading === "CANCELLED"}
          >
            Cancel booking
          </Button>
        )}

      {canLeaveReview && !showReview && (
        <Button size="sm" onClick={() => setShowReview(true)}>
          Leave a review
        </Button>
      )}

      {showReview && (
        <div className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <Select
            label="Rating"
            value={reviewRating}
            onChange={(event) => setReviewRating(event.target.value)}
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} star{rating === 1 ? "" : "s"}
              </option>
            ))}
          </Select>
          <Textarea
            label="Comment"
            placeholder="Share your experience working with this helper."
            rows={3}
            value={reviewComment}
            onChange={(event) => setReviewComment(event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={submitReview}
              loading={loading === "REVIEW"}
            >
              Submit review
            </Button>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => setShowReview(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

