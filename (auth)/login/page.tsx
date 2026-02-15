import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Sign in | Help Buddy",
  description: "Access your Help Buddy account to book helpers or manage your services.",
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 py-16 dark:bg-slate-950">
      <Card className="w-full max-w-md space-y-6 p-8">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to track your bookings, manage your profile, and connect with helpers.
          </CardDescription>
        </CardHeader>
        <LoginForm />
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          New to Help Buddy?{" "}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}

