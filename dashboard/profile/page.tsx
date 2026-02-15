import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/profile/profile-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export default async function ProfileSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      helperProfile: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="bg-slate-50 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Profile settings
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Tell others who you are, the services you offer, and how to reach you.
          </p>
        </div>

        <Card className="p-6">
          <CardHeader className="px-0">
            <CardTitle>Basic information</CardTitle>
            <CardDescription>
              Your profile details help requesters find you and build trust.
            </CardDescription>
          </CardHeader>
          <ProfileForm
            role={session.user.role}
            profile={user.profile}
            helperProfile={
              user.helperProfile
                ? {
                    headline: user.helperProfile.headline,
                    services: user.helperProfile.services,
                    hourlyRate: user.helperProfile.hourlyRate
                      ? Number(user.helperProfile.hourlyRate)
                      : null,
                    yearsOfExperience: user.helperProfile.yearsOfExperience,
                    travelRadiusKm: user.helperProfile.travelRadiusKm,
                  }
                : undefined
            }
          />
        </Card>
      </div>
    </div>
  );
}

