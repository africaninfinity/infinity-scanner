import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Sharing } from 'expo-sharing';
import { getTheme } from '../theme';
import { useAppStore } from '../store/appStore';
import { DocumentEntry } from '../types';
import { formatDocumentDate } from '../lib/document';
import { ActionButton } from '../components/ActionButton';

type LibraryScreenProps = {
  onBack: () => void;
  onOpen: (documentId: string) => void;
  onScan: () => void;
};

export const LibraryScreen = ({ onBack, onOpen, onScan }: LibraryScreenProps) => {
  const { documents, settings, searchQuery, setSearchQuery, removeDocument, updateDocument } = useAppStore();
  const theme = getTheme(settings.theme);
  const [query, setQuery] = React.useState(searchQuery);

  const visible = React.useMemo(() => {
    if (!query.trim()) return documents;
    const q = query.toLowerCase();
    return documents.filter((doc) => doc.name.toLowerCase().includes(q));
  }, [documents, query]);

  const handleRename = (doc: DocumentEntry) => {
    const nextName = prompt('Rename document', doc.name);
    if (nextName && nextName.trim() && nextName !== doc.name) {
      updateDocument(doc.id, { name: nextName.trim(), updatedAt: new Date().toISOString() });
    }
  };

  const handleShare = async (doc: DocumentEntry) => {
    try {
      await Sharing.shareAsync(doc.pages[0]?.uri || '', {
        mimeType: 'image/jpeg',
        dialogTitle: `Share ${doc.name}`,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleDelete = (doc: DocumentEntry) => {
    const confirm = prompt(`Delete "${doc.name}"? Type DELETE to confirm`, '');
    if (confirm === 'DELETE') {
      removeDocument(doc.id);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={{ color: theme.colors.primary, fontSize: 18, fontWeight: '700' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Library</Text>
      </View>

      <View style={[styles.searchBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={{ color: theme.colors.muted, fontSize: 18 }}>🔍</Text>
        <TextInput
          value={query}
          onChangeText={(value) => {
            setQuery(value);
            setSearchQuery(value);
          }}
          placeholder="Search documents"
          placeholderTextColor={theme.colors.muted}
          style={[styles.input, { color: theme.colors.text }]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {visible.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No documents</Text>
            <Text style={[styles.emptyText, { color: theme.colors.muted }]}>Tap "Scan" to create your first document</Text>
          </View>
        ) : (
          visible.map((doc) => (
            <View key={doc.id} style={[styles.docCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              {doc.pages.length > 0 && doc.pages[0]?.uri ? (
                <Image source={{ uri: doc.pages[0].uri }} style={styles.docThumbnail} resizeMode="cover" />
              ) : (
                <View style={[styles.docThumbnail, { backgroundColor: theme.colors.border }]} />
              )}

              <View style={styles.docInfo}>
                <Text style={[styles.docName, { color: theme.colors.text }]}>{doc.name}</Text>
                <Text style={[styles.docMeta, { color: theme.colors.muted }]}>
                  {formatDocumentDate(doc.createdAt)} • {doc.pageCount} pages
                </Text>
              </View>

              <View style={styles.docActions}>
                <TouchableOpacity
                  onPress={() => onOpen(doc.id)}
                  style={[styles.actionBtn, { backgroundColor: theme.colors.primary }]}
                >
                  <Text style={styles.actionBtnText}>Open</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleShare(doc)}
                  style={[styles.actionBtn, { backgroundColor: theme.colors.accent }]}
                >
                  <Text style={styles.actionBtnText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRename(doc)}
                  style={[styles.actionBtn, { backgroundColor: theme.colors.muted }]}
                >
                  <Text style={styles.actionBtnText}>Rename</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(doc)}
                  style={[styles.actionBtn, { backgroundColor: '#ef4444' }]}
                >
                  <Text style={styles.actionBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <ActionButton label="Back" onPress={onBack} variant="secondary" />
        <ActionButton label="Scan Document" onPress={onScan} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    minHeight: 48,
    marginHorizontal: 18,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 8,
  },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 140,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
  },
  docCard: {
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  docThumbnail: {
    width: '100%',
    height: 160,
    backgroundColor: '#ddd',
  },
  docInfo: {
    padding: 12,
  },
  docName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  docMeta: {
    fontSize: 12,
  },
  docActions: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingBottom: 12,
    flexWrap: 'wrap',
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 22,
    flexDirection: 'row',
    gap: 12,
  },
});
