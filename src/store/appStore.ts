import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, DocumentEntry, FilterType } from '../types';

const defaultSettings: AppSettings = {
  theme: 'light',
  defaultFilter: 'Original',
  pdfQuality: 'Balanced',
  autoEdgeDetection: false,
  ocrEnabled: false,
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
      documents: [],
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
  'Grayscale',
  'Black & White',
  'High Contrast',
  'Auto Enhance',
  'Color',
  'Document',
];
