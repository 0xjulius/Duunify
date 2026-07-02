"use client";
import { createContext, useContext, useState } from "react";
import LogoutModal from "@/components/logout/LogoutConfirmModal";

interface ModalContextType {
  showLogout: (displayName?: string) => void;
}

const ModalContext = createContext<ModalContextType>({
  showLogout: () => {},
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [logoutName, setLogoutName] = useState<string | undefined>(undefined);

  function showLogout(displayName?: string) {
    setLogoutName(displayName);
    setIsLogoutOpen(true);
  }

  function closeLogout() {
    setIsLogoutOpen(false);
    setLogoutName(undefined);
  }

  return (
    <ModalContext.Provider value={{ showLogout }}>
      {children}
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={closeLogout}
        displayName={logoutName}
      />
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);