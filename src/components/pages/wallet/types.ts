import { createContext } from "react";
import { QrCodeContextType } from "../../qrcode/qrcode-types/types";

export const WalletQrCodeContext = createContext<QrCodeContextType | null>(null);
