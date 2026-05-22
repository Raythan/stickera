export type TradeQrScannerProps = {
  onScan: (decodedText: string) => void;
  active?: boolean;
};
