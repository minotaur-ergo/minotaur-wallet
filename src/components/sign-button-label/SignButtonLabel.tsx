import { WalletType } from "@/db/entities/Wallet";
import { useSignerWallet } from "@/hooks/multi-sig/useSignerWallet";
import { StateWallet } from "@/store/reducer/wallet"

interface SignButtonLabelPropsType {
    wallet: StateWallet
}

const SignButtonLabel = (props: SignButtonLabelPropsType) => {
    const signer = useSignerWallet(props.wallet);
    if (props.wallet.type === WalletType.ReadOnly || (signer !== undefined && signer.type == WalletType.ReadOnly)) return 'Scan Signed';
    if (props.wallet.type === WalletType.Normal) return 'Sign';
    if (props.wallet.type === WalletType.MultiSig) return 'Start Signing';
  }


export default SignButtonLabel;