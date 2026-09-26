import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getTheme } from '../theme';
import { useAppStore } from '../store/appStore';
import { ActionButton } from '../components/ActionButton';
import { DocumentCard } from '../components/DocumentCard';
import { DocumentEntry } from '../types';

type HomeScreenProps = {
  documents: DocumentEntry[];
  searchQuery: string;
  onSearch: (value: string) => void;
  onScan: () => void;
  onOpen: (documentId: string) => void;
  onLibrary: () => void;
  onSettings: () => void;
  onCreate: () => void;
  onImport: () => void;
};

export const HomeScreen = ({
  documents,
  searchQuery,
  onSearch,
  onScan,
  onOpen,
  onLibrary,
  onSettings,
  onCreate,
  onImport,
}: HomeScreenProps) => {
  const { settings } = useAppStore();
  const theme = getTheme(settings.theme);

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topbar}>
          <View>
            <Text style={[styles.eyebrow, { color: theme.colors.muted }]}>Infinity Scanner</Text>
            <Text style={[styles.title, { color: theme.colors.text }]}>Smart document scans</Text>
          </View>
          <TouchableOpacity onPress={onSettings} style={[styles.iconButton, { backgroundColor: theme.colors.card }]}>
            <Text style={{ color: theme.colors.text, fontSize: 20 }}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.searchBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={{ color: theme.colors.muted, fontSize: 18 }}>⌕</Text>
          <TextInput
            value={searchQuery}
            onChangeText={onSearch}
            placeholder="Search documents"
            placeholderTextColor={theme.colors.muted}
            style={[styles.searchInput, { color: theme.colors.text }]}
          />
        </View>

        <View style={styles.buttonRow}>
          <ActionButton label="Scan Document" onPress={onScan} />
        </View>

        <View style={styles.secondaryRow}>
          <ActionButton label="Create" onPress={onCreate} variant="secondary" />
          <ActionButton label="Import" onPress={onImport} variant="secondary" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent documents</Text>
          <TouchableOpacity onPress={onLibrary}>
            <Text style={[styles.link, { color: theme.colors.primary }]}>See all</Text>
          </TouchableOpacity>
        </View>

        {documents.length > 0 ? (
          documents.slice(0, 5).map((doc) => (
            <TouchableOpacity key={doc.id} onPress={() => onOpen(doc.id)}>
              <DocumentCard document={doc} onPress={() => onOpen(doc.id)} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={[styles.empty, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No documents yet</Text>
            <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
              Scan your first document to populate the library.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 18,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 90,
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 16,
    minHeight: 52,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
  },
  buttonRow: {
    marginBottom: 12,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  link: {
    fontSize: 13,
    fontWeight: '700',
  },
  empty: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
  },
});
