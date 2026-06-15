import { create } from "zustand";
//import { persist, createJSONStorage } from "zustand/middleware";
//import AsyncStorage from "@react-native-async-storage/async-storage";

//TODO: replace with supabase auth

type AuthStore = {
  isStaffLoggedIn: boolean;

  login: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  //persist(
  (set) => ({
    isStaffLoggedIn: false,

    login: () => {
      set({ isStaffLoggedIn: true });
    },

    logout: () => {
      set({ isStaffLoggedIn: false });
    },
  }),
  /* 
  {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
  */
);
