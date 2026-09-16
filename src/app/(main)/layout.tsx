import type { ReactNode } from "react";
import { HydrateOnMount } from "@/components/hydrate";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HydrateOnMount />
      {children}
    </>
  );
}
