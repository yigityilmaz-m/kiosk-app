import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";

type AuthStore = {
  session: Session | null;
  isStaff: boolean;
  setSession: (session: Session | null) => void;
  clearSession: () => void;
};
//TODO: add persist
export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  isStaff: false,

  setSession: (session) => set({ session, isStaff: session !== null }),

  clearSession: () => set({ session: null, isStaff: false }),
}));
