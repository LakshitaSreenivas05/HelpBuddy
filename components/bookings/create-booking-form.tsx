"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CreateBookingFormProps {
  helperId: string;
  helperName: string;
}

interface FormState {
  title: string;
  description: string;
  scheduledAt: string;
  durationMinutes: string;
  location: string;
  price: string;
  notes: string;
}

const defaultState: FormState = {
  title: "",
  description: "",
  scheduledAt: "",
  durationMinutes: "",
  location: "",
  price: "",
  notes: "",
};

export function CreateBookingForm({
  helperId,
  helperName,
}: CreateBookingFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<FormState>(defaultState);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!session && status !== "loading") {
      setError("You need to log in to book a helper.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Convert datetime-local format to ISO datetime string
      // datetime-local returns format like "2024-01-15T14:30" (no timezone)
      // We need to convert it to ISO format for the validator
      if (!formState.scheduledAt) {
        throw new Error("Please select a date and time for your booking.");
      }
      
      const date = new Date(formState.scheduledAt);
      if (isNaN(date.getTime())) {
        throw new Error("Please provide a valid date and time.");
      }
      
      const scheduledAtISO = date.toISOString();
      
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          helperId,
          title: formState.title,
          description: formState.description || undefined,
          scheduledAt: scheduledAtISO,
          durationMinutes: formState.durationMinutes
            ? Number(formState.durationMinutes)
            : undefined,
          location: formState.location || undefined,
          price: formState.price ? Number(formState.price) : undefined,
          notes: formState.notes || undefined,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        
        // Handle validation errors
        if (payload.error && typeof payload.error === "object") {
          const errorMessages = Object.entries(payload.error)
            .map(([field, errors]) => {
              const errorArray = Array.isArray(errors) ? errors : [errors];
              return `${field}: ${errorArray.join(", ")}`;
            })
            .join("\n");
          throw new Error(errorMessages || "Please check your input and try again.");
        }
        
        throw new Error(
          typeof payload.error === "string"
            ? payload.error
            : "Unable to submit booking request. Please try again.",
        );
      }

      setSuccess("Booking request sent! We'll notify the helper to confirm.");
      setFormState(defaultState);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session && status !== "loading") {
    return (
      <div className="space-y-3 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-blue-800 dark:border-blue-400/40 dark:bg-blue-500/10 dark:text-blue-100">
        <div>
          <p className="text-sm font-medium">
            Log in to send a booking request to {helperName}.
          </p>
          <p className="mt-2 text-sm">
            Once logged in, you can schedule a time and share any details about your project.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            onClick={() => router.push("/login?redirect=/helpers/" + helperId)}
          >
            Log in to continue
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/register")}
          >
            Create an account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      id="booking-form"
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Request a booking
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Share a bit about your task and when you need help. The helper will confirm or suggest a new time.
        </p>
      </div>

      <Input
        label="What do you need help with?"
        placeholder="e.g. Set up a new Wi-Fi router"
        required
        value={formState.title}
        onChange={(event) => updateField("title", event.target.value)}
      />

      <Textarea
        label="Provide details"
        placeholder="Share context, goals, or special requirements."
        rows={4}
        value={formState.description}
        onChange={(event) => updateField("description", event.target.value)}
      />

      <Input
        label="Preferred date & time"
        type="datetime-local"
        required
        value={formState.scheduledAt}
        onChange={(event) => updateField("scheduledAt", event.target.value)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Estimated duration (minutes)"
          type="number"
          min={15}
          step={15}
          value={formState.durationMinutes}
          onChange={(event) => updateField("durationMinutes", event.target.value)}
        />
        <Input
          label="Budget estimate (USD)"
          type="number"
          min={0}
          step={5}
          value={formState.price}
          onChange={(event) => updateField("price", event.target.value)}
        />
      </div>

      <Input
        label="Location"
        placeholder="Address or meeting point"
        value={formState.location}
        onChange={(event) => updateField("location", event.target.value)}
      />

      <Textarea
        label="Notes for the helper"
        placeholder="Optional instructions or context."
        rows={3}
        value={formState.notes}
        onChange={(event) => updateField("notes", event.target.value)}
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-200">
          <div className="whitespace-pre-line">{error}</div>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/30 dark:text-emerald-200">
          {success}
        </div>
      )}

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Send booking request
      </Button>
    </form>
  );
}

