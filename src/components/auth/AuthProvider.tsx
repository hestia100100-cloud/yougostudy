"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { fetchProfile, saveProfile } from "@/lib/supabase/profiles";
import type { AnimalType, UserProfile } from "@/types";
import { WelcomeScreen } from "./WelcomeScreen";

type AuthStatus = "loading" | "unconfigured" | "needs-profile" | "ready" | "error";

interface AuthContextValue {
  profile: UserProfile;
  updateProfile: (fields: { username: string; animal: AnimalType }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** The signed-in user's profile. Only usable inside the authenticated app shell. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/**
 * Anonymous Supabase auth + profile. Shows the welcome screen until the user
 * has a session and a profile (username + animal), then renders the app.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(isSupabaseConfigured ? "loading" : "unconfigured");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase().auth.getSession();
        const userId = data.session?.user.id;
        const existing = userId ? await fetchProfile(userId) : null;
        if (cancelled) return;
        setProfile(existing);
        setStatus(existing ? "ready" : "needs-profile");
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
        setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateProfile = useCallback(async (fields: { username: string; animal: AnimalType }) => {
    const auth = supabase().auth;
    let { data } = await auth.getSession();
    if (!data.session) {
      const res = await auth.signInAnonymously();
      if (res.error) throw res.error;
      ({ data } = await auth.getSession());
    }
    const saved = await saveProfile(data.session!.user.id, fields);
    setProfile(saved);
    setStatus("ready");
  }, []);

  if (status === "ready" && profile) {
    return <AuthContext.Provider value={{ profile, updateProfile }}>{children}</AuthContext.Provider>;
  }
  return <WelcomeScreen status={status} error={error} onSubmit={updateProfile} />;
}
