import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, DocumentEntry, FilterType } from '../types';

const defaultSettings: AppSettings = {
  theme: 'light',
  defaultFilter: 'Auto Enhance',
  pdfQuality: 'Balanced',
  autoEdgeDetection: true,
  ocrEnabled: true,
};

type StoreState = {
  documents: DocumentEntry[];
  settings: AppSettings;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  addDocument: (doc: DocumentEntry) => void;
  updateDocument: (docId: string, updates: Partial<DocumentEntry>) => void;
  removeDocument: (docId: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
};

export const useAppStore = create<StoreState>()(
  persist(
    (set) => ({
      documents: [
        {
          id: 'sample-1',
          name: 'Quarterly Summary',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pages: [
            {
              id: 'sample-page-1',
              uri: 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
              filter: 'Document',
              brightness: 100,
              contrast: 110,
              rotation: 0,
              width: 1200,
              height: 1600,
              ocrText: 'Quarterly summary. Revenue increased by 18% year-over-year.',
              corners: [
                { x: 0.2, y: 0.18 },
                { x: 0.82, y: 0.18 },
                { x: 0.9, y: 0.84 },
                { x: 0.12, y: 0.84 },
              ],
            },
          ],
          pageCount: 1,
          ocrText: 'Quarterly summary. Revenue increased by 18% year-over-year.',
        },
      ],
      settings: defaultSettings,
      searchQuery: '',
      setSearchQuery: (value: string) => set({ searchQuery: value }),
      addDocument: (doc: DocumentEntry) =>
        set((state) => ({
          documents: [doc, ...state.documents],
        })),
      updateDocument: (docId: string, updates: Partial<DocumentEntry>) =>
        set((state) => ({
          documents: state.documents.map((doc) => (doc.id === docId ? { ...doc, ...updates } : doc)),
        })),
      removeDocument: (docId: string) =>
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== docId),
        })),
      setTheme: (theme: 'light' | 'dark') =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),
      updateSettings: (patch: Partial<AppSettings>) =>
        set((state) => ({
          settings: { ...state.settings, ...patch },
        })),
    }),
    {
      name: 'infinity-scanner-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const FILTERS: FilterType[] = [
  'Original',
  'Auto Enhance',
  'Black & White',
  'Grayscale',
  'Color',
  'Document',
  'High Contrast',
];
