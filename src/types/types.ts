export type User = {
  id: string;
  email: string;
  name: string;
  image: string | null;
  recruiter: null | {
    id: string;
    name: string;
    organization: string;
    phone: string;
    address: string;
  };
};

export type AuthStatus = "authenticated" | "unauthenticated" | "loading";

export type UseSessionReturn =
  | {
      data: {
        user: User;
      };
      status: "authenticated";
      error: null;
      refresh: () => Promise<void>;
    }
  | {
      data: null;
      status: "unauthenticated" | "loading";
      error: string | null;
      refresh: () => Promise<void>;
    };

export type CacheEntry = {
  data: User;
};

export type ServerSessionReturn =
  | {
      data: User;
      status: "authenticated";
      error: null;
    }
  | {
      data: null;
      status: "unauthenticated" | "loading";
      error: string | null;
    };
