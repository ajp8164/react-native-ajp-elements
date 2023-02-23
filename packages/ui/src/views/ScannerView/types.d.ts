export declare type ScannerView = ScannerViewMethods;

export interface ScannerViewProps {
  onCancel: () => void;
  onScan: (data: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ScannerViewMethods {}
