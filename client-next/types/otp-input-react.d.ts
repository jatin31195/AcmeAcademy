// otp-input-react ships no TypeScript types (and no @types package exists).
// Minimal ambient declaration so the Signup page (a verbatim port using this
// library) type-checks without changing its behavior.
declare module "otp-input-react" {
  import type { ComponentType } from "react";

  export interface OTPInputProps {
    value: string;
    onChange: (value: string) => void;
    OTPLength?: number;
    otpType?: "number" | "alphanumeric" | "any";
    autoFocus?: boolean;
    disabled?: boolean;
    className?: string;
    inputClassName?: string;
  }

  const OtpInput: ComponentType<OTPInputProps>;
  export default OtpInput;
}
