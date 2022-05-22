import { createContext } from "react";
import { QrCodeContextType } from "../../qrcode/qrcode-types/types";

export const CreateWalletQrCodeContext = createContext<QrCodeContextType | null>(null);
