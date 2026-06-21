"use client";

import { forwardRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

interface HCaptchaFieldProps {
  onVerify: (token: string) => void;
  onExpire: () => void;
}

const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

const HCaptchaField = forwardRef<HCaptcha, HCaptchaFieldProps>(
  function HCaptchaField({ onVerify, onExpire }, ref) {
    if (!siteKey) {
      return (
        <div className="rounded-[8px] border border-border bg-muted px-4 py-3">
          <p className="text-[12px] text-foreground-muted font-sans">
            Verificación no disponible.{" "}
            <span className="font-medium text-foreground">
              Configura NEXT_PUBLIC_HCAPTCHA_SITE_KEY en .env.local.
            </span>
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <HCaptcha
          ref={ref}
          sitekey={siteKey}
          onVerify={onVerify}
          onExpire={onExpire}
          theme="light"
        />
      </div>
    );
  }
);

HCaptchaField.displayName = "HCaptchaField";

export { HCaptchaField };
