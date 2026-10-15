"use client";

import { createContext, type ReactNode, type TransitionStartFunction, use, useTransition } from "react";

interface PageLoading {
  isLoading: boolean;
  /** Runs a router update (push, replace or refresh); `isLoading` stays true until the new page has rendered. */
  loadPage: TransitionStartFunction;
}

const PageLoadingContext = createContext<PageLoading>({ isLoading: false, loadPage: (update) => update() });

export function PageLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, loadPage] = useTransition();
  return <PageLoadingContext value={{ isLoading, loadPage }}>{children}</PageLoadingContext>;
}

export function usePageLoading() {
  return use(PageLoadingContext);
}

/** Dims the current page and shows a spinner over it while the next page loads. */
export function PageLoadingOverlay() {
  const { isLoading } = usePageLoading();
  if (!isLoading) return null;
  return (
    <div className="loading-overlay">
      <span className="spinner" role="status" aria-label="Loading" />
    </div>
  );
}
