"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AppSidebar } from "./AppSidebar";

interface MobileNavProps {
  displayName: string;
  email: string;
  plan: "free" | "pro" | "max";
}

export function MobileNav({ displayName, email, plan }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="flex items-center justify-center w-9 h-9 rounded-[8px] text-foreground-muted hover:bg-muted hover:text-foreground transition-colors duration-150 active:scale-[0.95]"
      >
        <Menu size={18} strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="fixed left-0 top-0 bottom-0 z-50 w-60 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
            >
              <AppSidebar displayName={displayName} email={email} plan={plan} onClose={() => setOpen(false)} />
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="absolute top-3.5 right-3 flex items-center justify-center w-8 h-8 rounded-[8px] text-foreground-muted hover:bg-muted hover:text-foreground transition-colors duration-150"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
