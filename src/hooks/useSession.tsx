"use client";
import { useState, useEffect } from "react";
import { env } from "~/env";
import type {
  User,
  AuthStatus,
  UseSessionReturn,
  CacheEntry,
} from "~/types/types";

// Create a custom event for session changes
const SESSION_CHANGE_EVENT = "session-change";

// Event emitter for session changes
export const sessionEvents = {
  emit: () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(SESSION_CHANGE_EVENT));
    }
  },
};

const cache: { [key: string]: CacheEntry } = {};
let globalPromise: Promise<{ session: { user: User } }> | null = null;

export const useSession = (): UseSessionReturn => {
  const [data, setData] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (forceRefresh = false) => {
    const cachedData = cache["session"];

    if (!forceRefresh && cachedData) {
      setData(cachedData.data);
      setStatus("authenticated");
      return;
    }

    if (forceRefresh && globalPromise) {
      globalPromise = null;
    }

    if (!globalPromise) {
      globalPromise = fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/auth/session`, {
        method: "GET",
        credentials: "include",
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          return response.json();
        })
        .then(({ session }: { session: { user: User } }) => {
          cache["session"] = {
            data: session.user,
          };
          return { session };
        })
        .catch((err) => {
          throw err;
        });
    }

    try {
      const User = await globalPromise;
      setData(User.session.user);
      setStatus("authenticated");
      setError(null);
    } catch (err) {
      setData(null);
      setError((err as Error).message);
      setStatus("unauthenticated");
    } finally {
      globalPromise = null;
    }
  };

  // Function to manually refresh the session
  const refreshSession = async () => {
    setData(null);
    setStatus("loading");
    setError(null);
    await fetchUser(true);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Listen for session change events
  useEffect(() => {
    const handleSessionChange = () => {
      refreshSession();
    };

    if (typeof window !== "undefined") {
      window.addEventListener(SESSION_CHANGE_EVENT, handleSessionChange);

      return () => {
        window.removeEventListener(SESSION_CHANGE_EVENT, handleSessionChange);
      };
    }
  }, []);
  // Using type assertion to match our discriminated union

  return {
    data: {
      user: data,
    },
    status,
    error,
    refresh: refreshSession,
  } as UseSessionReturn;
};

export const clearSessionCache = () => {
  delete cache["session"];
  globalPromise = null;
  // Emit event to notify all hooks to revalidate
  sessionEvents.emit();
};
