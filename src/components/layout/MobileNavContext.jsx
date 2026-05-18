import React, { createContext, useCallback, useContext, useState } from "react";

const MobileNavContext = createContext(null);

export function MobileNavProvider({ children }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <MobileNavContext.Provider value={{ open, setOpen, close }}>
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav() {
  const ctx = useContext(MobileNavContext);
  if (!ctx) {
    return { open: false, setOpen: () => {}, close: () => {} };
  }
  return ctx;
}
