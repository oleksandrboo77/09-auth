"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiCheckSession, apiGetMe, apiLogout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

const PRIVATE_PREFIXES = ["/profile", "/notes"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clearIsAuthenticated);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const session = await apiCheckSession();

        if (session) {
          const me = await apiGetMe().catch(() => session);
          if (mounted) setUser(me || session);
        } else {
          if (PRIVATE_PREFIXES.some((p) => pathname.startsWith(p))) {
            await apiLogout().catch(() => {});
            clear();
            router.replace("/sign-in");
            return;
          }
        }
      } finally {
        if (mounted) setChecking(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [pathname, router, setUser, clear]);

  if (checking) return <div style={{ padding: 24 }}>Loading…</div>;
  return <>{children}</>;
}
