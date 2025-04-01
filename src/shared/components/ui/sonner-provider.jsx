import React from "react";
import { Toaster } from "sonner";

export function SonnerProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "border-0",
      }}
      richColors
      closeButton
    />
  );
}