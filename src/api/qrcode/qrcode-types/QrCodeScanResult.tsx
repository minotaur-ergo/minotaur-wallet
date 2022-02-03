export const TxSignR: string = "CSR";
export const TxPublishR: string = "CSTX";

const types = [
    TxSignR,
    TxPublishR
];
export const detectType = (name: string): string => {
    if (types.indexOf(name) >= 0) {
        return name;
    }
    return "";
};
