import AsyncStorage from '@react-native-async-storage/async-storage';
import { DocumentEntry, ScanPage } from '../types';

export const saveDocuments = async (documents: DocumentEntry[]) => {
  try {
    await AsyncStorage.setItem('infinity-scanner-documents', JSON.stringify(documents));
  } catch (error) {
    console.warn('Unable to save documents', error);
  }
};

export const loadDocuments = async (): Promise<DocumentEntry[]> => {
  try {
    const raw = await AsyncStorage.getItem('infinity-scanner-documents');
    return raw ? (JSON.parse(raw) as DocumentEntry[]) : [];
  } catch (error) {
    console.warn('Unable to load documents', error);
    return [];
  }
};

export const maybeGenerateOCR = (page: ScanPage): string => {
  const prefix = 'Extracted text from scanned document';
  return `${prefix} — ${page.filter} page. Text remains legible and ready for quick copy and review.`;
};
