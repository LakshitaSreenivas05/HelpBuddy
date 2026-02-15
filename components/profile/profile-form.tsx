"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { splitCommaSeparated } from "@/lib/utils";

interface ProfileFormProps {
  role: "HELPER" | "REQUESTER" | "ADMIN";
  profile: {
    displayName?: string | null;
    bio?: string | null;
    location?: string | null;
    phone?: string | null;
    skills?: string[];
    languages?: string[];
    avatarUrl?: string | null;
  } | null;
  helperProfile?: {
    headline?: string | null;
    services?: string[];
    hourlyRate?: number | null;
    yearsOfExperience?: number | null;
    travelRadiusKm?: number | null;
  } | null;
}

export function ProfileForm({ role, profile, helperProfile }: ProfileFormProps) {
  const [formState, setFormState] = useState({
    displayName: profile?.displayName ?? "",
    bio: profile?.bio ?? "",
    location: profile?.location ?? "",
    phone: profile?.phone ?? "",
    skills: (profile?.skills ?? []).join(", "),
    languages: (profile?.languages ?? []).join(", "),
    avatarUrl: profile?.avatarUrl ?? "",
    headline: helperProfile?.headline ?? "",
    services: (helperProfile?.services ?? []).join(", "),
    hourlyRate:
      helperProfile?.hourlyRate !== undefined && helperProfile?.hourlyRate !== null
        ? helperProfile.hourlyRate.toString()
        : "",
    yearsOfExperience:
      helperProfile?.yearsOfExperience !== undefined &&
      helperProfile?.yearsOfExperience !== null
        ? helperProfile.yearsOfExperience.toString()
        : "",
    travelRadiusKm:
      helperProfile?.travelRadiusKm !== undefined &&
      helperProfile?.travelRadiusKm !== null
        ? helperProfile.travelRadiusKm.toString()
        : "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateField = (key: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: formState.displayName,
          bio: formState.bio,
          location: formState.location,
          phone: formState.phone,
          avatarUrl: formState.avatarUrl,
          skills: splitCommaSeparated(formState.skills),
          languages: splitCommaSeparated(formState.languages),
          headline: formState.headline,
          services: splitCommaSeparated(formState.services),
          hourlyRate: formState.hourlyRate ? Number(formState.hourlyRate) : undefined,
          yearsOfExperience: formState.yearsOfExperience
            ? Number(formState.yearsOfExperience)
            : undefined,
          travelRadiusKm: formState.travelRadiusKm
            ? Number(formState.travelRadiusKm)
            : undefined,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(
          typeof payload.error === "string"
            ? payload.error
            : "Unable to update profile.",
        );
      }

      setSuccess("Profile updated successfully.");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Display name"
          value={formState.displayName}
          onChange={(event) => updateField("displayName", event.target.value)}
          placeholder="How should helpers/clients address you?"
        />
        <Input
          label="Location"
          value={formState.location}
          onChange={(event) => updateField("location", event.target.value)}
          placeholder="City, State"
        />
      </div>
      <Input
        label="Phone"
        value={formState.phone}
        onChange={(event) => updateField("phone", event.target.value)}
        placeholder="+1 (555) 555-5555"
      />
      <Textarea
        label="Bio"
        rows={4}
        value={formState.bio}
        onChange={(event) => updateField("bio", event.target.value)}
        placeholder="Tell others about your experience and what you can help with."
      />
      <Input
        label="Profile photo URL"
        value={formState.avatarUrl}
        onChange={(event) => updateField("avatarUrl", event.target.value)}
        placeholder="https://example.com/avatar.jpg"
      />
      <Input
        label="Skills"
        value={formState.skills}
        onChange={(event) => updateField("skills", event.target.value)}
        placeholder="Comma separated (e.g., Wi-Fi setup, furniture assembly)"
      />
      <Input
        label="Languages"
        value={formState.languages}
        onChange={(event) => updateField("languages", event.target.value)}
        placeholder="Comma separated (e.g., English, Spanish)"
      />

      {(role === "HELPER" || role === "ADMIN") && (
        <div className="space-y-4 rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Helper details
          </h3>
          <Input
            label="Headline"
            value={formState.headline}
            onChange={(event) => updateField("headline", event.target.value)}
            placeholder="e.g., Friendly tech support specialist"
          />
          <Input
            label="Services offered"
            value={formState.services}
            onChange={(event) => updateField("services", event.target.value)}
            placeholder="Comma separated (e.g., PC setup, smart home installation)"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Hourly rate (USD)"
              type="number"
              min={0}
              step={5}
              value={formState.hourlyRate}
              onChange={(event) => updateField("hourlyRate", event.target.value)}
            />
            <Input
              label="Years of experience"
              type="number"
              min={0}
              step={1}
              value={formState.yearsOfExperience}
              onChange={(event) =>
                updateField("yearsOfExperience", event.target.value)
              }
            />
            <Input
              label="Travel radius (km)"
              type="number"
              min={0}
              step={1}
              value={formState.travelRadiusKm}
              onChange={(event) =>
                updateField("travelRadiusKm", event.target.value)
              }
            />
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-900/30 dark:text-emerald-100">
          {success}
        </div>
      )}

      <Button type="submit" loading={isSubmitting}>
        Save changes
      </Button>
    </form>
  );
}

