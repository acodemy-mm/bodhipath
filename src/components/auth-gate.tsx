"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

const PUBLIC = new Set(["/", "/auth"]);

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { ready, profile } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const isPublic = PUBLIC.has(pathname);

    if (!profile && !isPublic) {
      router.replace("/auth");
      return;
    }

    if (profile && pathname === "/auth") {
      router.replace(
        profile.onboarding_complete ? "/home" : "/onboarding",
      );
      return;
    }

    if (
      profile &&
      !profile.onboarding_complete &&
      pathname !== "/onboarding" &&
      !isPublic
    ) {
      router.replace("/onboarding");
      return;
    }

    if (profile?.onboarding_complete && pathname === "/onboarding") {
      router.replace("/home");
    }
  }, [ready, profile, pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-gold-soft/80">
        ဗောဓိလမ်း တင်နေသည်…
      </div>
    );
  }

  return <>{children}</>;
}
