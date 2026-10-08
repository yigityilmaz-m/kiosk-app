"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * false on the server and during the first client render (so it matches the
 * server HTML), true afterwards. Use it to gate anything that reads persisted
 * state, e.g. the basket badge.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
