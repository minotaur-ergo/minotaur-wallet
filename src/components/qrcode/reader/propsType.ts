export interface QrCodePropsType {
  handleScan: (scan: string) => unknown;
  handleError: () => unknown;
}
