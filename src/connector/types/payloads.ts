import { APIError } from "./errors";
import { Box, SignedInput, SignedTx, Tx, TxId } from "./blockchain";

export type Paginate = {
    page: number;
    limit: number;
};

export type ConfirmPayload = {
    id: string;
    display: string;
}

export type ConfirmResponsePayload = {
    confirmed: boolean
}

export type BoxRequestPayload = {
    amount: string;
    tokenId: string;
    page: Paginate;
}

export type BoxResponsePayload = Array<Box> | undefined;

export type BalanceRequestPayload = {
    tokenIds: Array<string>;
}

export type BalanceResponsePayload = { [tokenId: string]: string }

export type AddressRequestPayload = {
    type: "used" | "unused" | "change" | "all";
    page?: Paginate
}

export type AddressResponsePayload = Array<string>


export type SingTxRequestPayload = {
    tx: Tx;
    index: "all" | number;
}

export type SignTxResponsePayload = SignedTx | SignedInput;

export type SignDataRequestPayload = {
    address: string;
    message: string
}

export type SignDataResponsePayload = string;

export type SubmitTxRequestPayload = {
    tx: SignedTx;
}

export type SubmitTxResponsePayload = TxId;

export type ConnectPayload = {
    server?: string;
}
export type Payload = ConfirmPayload |
    ConnectPayload |
    ConfirmResponsePayload |
    BoxRequestPayload |
    BoxResponsePayload |
    BalanceRequestPayload |
    BalanceResponsePayload |
    AddressRequestPayload |
    AddressResponsePayload |
    SingTxRequestPayload |
    SignTxResponsePayload |
    SignDataRequestPayload |
    SignDataResponsePayload |
    SubmitTxRequestPayload |
    SubmitTxResponsePayload |
    APIError;
