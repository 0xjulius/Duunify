"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      expand
      duration={4000}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "duunify-toast",
          title: "duunify-toast-title",
          description: "duunify-toast-description",
          actionButton: "duunify-toast-action",
          cancelButton: "duunify-toast-cancel",
          closeButton: "duunify-toast-close",
          success: "duunify-toast-success",
          error: "duunify-toast-error",
          warning: "duunify-toast-warning",
          loading: "duunify-toast-loading",
        },
      }}
    />
  );
}