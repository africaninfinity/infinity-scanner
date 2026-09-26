import React, { useMemo, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useAppStore } from './src/store/appStore';
import { getTheme } from './src/theme';
import { CameraScreen } from './src/screens/CameraScreen';
import { EditorScreen } from './src/screens/EditorScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { BottomNav } from './src/components/BottomNav';
import { ScanPage } from './src/types';

export type ScreenName = 'home' | 'camera' | 'editor' | 'library' | 'settings';

export default function App() {
  const { documents, settings, addDocument, setSearchQuery, searchQuery } = useAppStore();
  const theme = getTheme(settings.theme);
  const [screen, setScreen] = useState<ScreenName>('home');
  const [sessionPages, setSessionPages] = useState<ScanPage[]>([]);
  const [sessionName, setSessionName] = useState('New Document');
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);

  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter((doc) => doc.name.toLowerCase().includes(q));
  }, [documents, searchQuery]);

  const handleCapture = (uri: string) => {
    const page: ScanPage = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      uri,
      filter: settings.defaultFilter,
      brightness: 100,
      contrast: 100,
      rotation: 0,
      width: 1200,
      height: 1600,
      ocrText: 'Captured document text preview. Extracted text will appear here when OCR is enabled.',
      corners: [
        { x: 0.15, y: 0.18 },
        { x: 0.85, y: 0.18 },
        { x: 0.9, y: 0.82 },
        { x: 0.1, y: 0.82 },
      ],
    };

    setSessionPages((prev) => [...prev, page]);
    setScreen('editor');
  };

  const handleSaveDocument = (name: string, pages: ScanPage[]) => {
    if (!pages.length) return;

    const doc = {
      id: `${Date.now()}`,
      name: name.trim() || 'Untitled Document',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pages,
      pageCount: pages.length,
      ocrText: pages.map((page) => page.ocrText).join('\n\n'),
    };

    addDocument(doc);
    setSessionPages([]);
    setSessionName('New Document');
    setScreen('home');
  };

  const handleOpenDocument = (documentId: string) => {
    setActiveDocumentId(documentId);
    setScreen('editor');
    const doc = documents.find((item) => item.id === documentId);
    if (doc) {
      setSessionPages(doc.pages);
      setSessionName(doc.name);
    }
  };

  const handleBack = () => {
    if (screen === 'editor') {
      setScreen('home');
      return;
    }
    if (screen === 'camera') {
      setScreen('home');
      return;
    }
    if (screen === 'library') {
      setScreen('home');
      return;
    }
    if (screen === 'settings') {
      setScreen('home');
      return;
    }
    setScreen('home');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ExpoStatusBar style={settings.theme === 'dark' ? 'light' : 'dark'} />
      <StatusBar barStyle={settings.theme === 'dark' ? 'light-content' : 'dark-content'} />

      {screen === 'home' && (
        <HomeScreen
          documents={filteredDocuments}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onScan={() => setScreen('camera')}
          onOpen={handleOpenDocument}
          onLibrary={() => setScreen('library')}
          onSettings={() => setScreen('settings')}
          onCreate={() => setScreen('camera')}
          onImport={() => setScreen('camera')}
        />
      )}

      {screen === 'camera' && (
        <CameraScreen
          onCapture={handleCapture}
          onBack={handleBack}
          autoEdgeDetection={settings.autoEdgeDetection}
        />
      )}

      {screen === 'editor' && (
        <EditorScreen
          documentName={sessionName}
          pages={sessionPages}
          onBack={handleBack}
          onPagesChange={setSessionPages}
          onSave={handleSaveDocument}
          defaultFilter={settings.defaultFilter}
          ocrEnabled={settings.ocrEnabled}
          pdfQuality={settings.pdfQuality}
          activeDocumentId={activeDocumentId}
        />
      )}

      {screen === 'library' && (
        <LibraryScreen
          onBack={handleBack}
          onOpen={handleOpenDocument}
          onScan={() => setScreen('camera')}
        />
      )}

      {screen === 'settings' && <SettingsScreen onBack={handleBack} />}

      {screen !== 'camera' && (
        <BottomNav
          active={screen}
          onHome={() => setScreen('home')}
          onLibrary={() => setScreen('library')}
          onScanner={() => setScreen('camera')}
          onSettings={() => setScreen('settings')}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
});
