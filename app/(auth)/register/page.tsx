import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Create an account | Help Buddy",
  description: "Join Help Buddy to request assistance or offer your skills as a helper.",
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 py-16 dark:bg-slate-950">
      <Card className="w-full max-w-lg space-y-6 p-8">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-2xl">Join Help Buddy</CardTitle>
          <CardDescription>
            Create an account to connect with local helpers or start offering your services.
          </CardDescription>
        </CardHeader>
        <RegisterForm />
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}

