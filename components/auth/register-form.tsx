"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "REQUESTER" | "HELPER";
}

const defaultState: RegisterFormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "REQUESTER",
};

export function RegisterForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<RegisterFormState>(defaultState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateField = <K extends keyof RegisterFormState>(
    key: K,
    value: RegisterFormState[K],
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (formState.password !== formState.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          password: formState.password,
          role: formState.role,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        if (payload?.error) {
          const message =
            typeof payload.error === "string"
              ? payload.error
              : Array.isArray(payload.error.email)
                ? payload.error.email[0]
                : "Unable to create account.";
          throw new Error(message);
        }
        throw new Error("Unable to create account. Please try again.");
      }

      setSuccess("Account created! Redirecting to sign in...");
      setFormState(defaultState);
      setTimeout(() => {
        router.push("/login");
      }, 1200);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full name"
        required
        value={formState.name}
        onChange={(event) => updateField("name", event.target.value)}
      />
      <Input
        label="Email"
        type="email"
        required
        value={formState.email}
        onChange={(event) => updateField("email", event.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Password"
          type="password"
          required
          value={formState.password}
          onChange={(event) => updateField("password", event.target.value)}
        />
        <Input
          label="Confirm password"
          type="password"
          required
          value={formState.confirmPassword}
          onChange={(event) => updateField("confirmPassword", event.target.value)}
        />
      </div>
      <Select
        label="I want to use Help Buddy as a"
        value={formState.role}
        onChange={(event) =>
          updateField("role", event.target.value as RegisterFormState["role"])
        }
      >
        <option value="REQUESTER">Requester (need help)</option>
        <option value="HELPER">Helper (offer services)</option>
      </Select>

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

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Create account
      </Button>
    </form>
  );
}

