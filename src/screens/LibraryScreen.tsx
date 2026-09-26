import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getTheme } from '../theme';
import { useAppStore } from '../store/appStore';
import { DocumentEntry } from '../types';
import { formatDocumentDate } from '../lib/document';

type LibraryScreenProps = {
  onBack: () => void;
  onOpen: (documentId: string) => void;
  onScan: () => void;
};

export const LibraryScreen = ({ onBack, onOpen, onScan }: LibraryScreenProps) => {
  const { documents, settings, searchQuery, setSearchQuery, removeDocument, updateDocument } = useAppStore();
  const theme = getTheme(settings.theme);
  const [query, setQuery] = useState(searchQuery);

  const visible = useMemo(() => {
    if (!query.trim()) return documents;
    const q = query.toLowerCase();
    return documents.filter((doc) => doc.name.toLowerCase().includes(q));
  }, [documents, query]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={{ color: theme.colors.text, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Library</Text>
      </View>

      <View style={[styles.searchBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={{ color: theme.colors.muted, fontSize: 18 }}>⌕</Text>
        <TextInput
          value={query}
          onChangeText={(value) => {
            setQuery(value);
            setSearchQuery(value);
          }}
          placeholder="Search saved documents"
          placeholderTextColor={theme.colors.muted}
          style={[styles.input, { color: theme.colors.text }]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {visible.map((doc) => (
          <View key={doc.id} style={[styles.row, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.metaText}>
              <Text style={[styles.docName, { color: theme.colors.text }]}>{doc.name}</Text>
              <Text style={[styles.docMeta, { color: theme.colors.muted }]}>
                {formatDocumentDate(doc.createdAt)} • {doc.pageCount} pages
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => onOpen(doc.id)}
                style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              >
                <Text style={styles.actionText}>Open</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const nextName = prompt('Rename document', doc.name);
                  if (nextName && nextName.trim()) {
                    updateDocument(doc.id, { name: nextName.trim(), updatedAt: new Date().toISOString() });
                  }
                }}
                style={[styles.actionButton, { backgroundColor: theme.colors.border }]}
              >
                <Text style={[styles.actionText, { color: theme.colors.text }]}>Rename</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeDocument(doc.id)}
                style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
              >
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={onScan} style={[styles.scanButton, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.scanButtonText}>Scan Document</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 18,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    minHeight: 52,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 8,
  },
  list: {
    paddingBottom: 120,
  },
  row: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  metaText: {
    marginBottom: 10,
  },
  docName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  docMeta: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 22,
  },
  scanButton: {
    minHeight: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
