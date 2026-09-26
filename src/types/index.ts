export type FilterType =
  | 'Original'
  | 'Auto Enhance'
  | 'Black & White'
  | 'Grayscale'
  | 'Color'
  | 'Document'
  | 'High Contrast';

export type ThemeMode = 'light' | 'dark';
export type PdfQuality = 'Draft' | 'Balanced' | 'High';

export type CornerPoint = {
  x: number;
  y: number;
};

export type ScanPage = {
  id: string;
  uri: string;
  filter: FilterType;
  brightness: number;
  contrast: number;
  rotation: number;
  width: number;
  height: number;
  ocrText: string;
  corners: CornerPoint[];
};

export type DocumentEntry = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  pages: ScanPage[];
  pageCount: number;
  ocrText?: string;
};

export type AppSettings = {
  theme: ThemeMode;
  defaultFilter: FilterType;
  pdfQuality: PdfQuality;
  autoEdgeDetection: boolean;
  ocrEnabled: boolean;
};
