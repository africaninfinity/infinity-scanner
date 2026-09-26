import React, { useMemo, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getTheme } from '../theme';
import { useAppStore } from '../store/appStore';
import { ActionButton } from '../components/ActionButton';
import { FilterPill } from '../components/FilterPill';
import { FILTERS } from '../store/appStore';
import { ScanPage } from '../types';

type EditorScreenProps = {
  documentName: string;
  pages: ScanPage[];
  onBack: () => void;
  onPagesChange: (pages: ScanPage[]) => void;
  onSave: (name: string, pages: ScanPage[]) => void;
  defaultFilter: string;
  ocrEnabled: boolean;
  pdfQuality: string;
  activeDocumentId: string | null;
};

export const EditorScreen = ({
  documentName,
  pages,
  onBack,
  onPagesChange,
  onSave,
  defaultFilter,
  ocrEnabled,
  pdfQuality,
  activeDocumentId,
}: EditorScreenProps) => {
  const { settings } = useAppStore();
  const theme = getTheme(settings.theme);
  const [name, setName] = useState(documentName);
  const [selectedPageId, setSelectedPageId] = useState<string>(pages[0]?.id ?? '');
  const [filter, setFilter] = useState<string>(defaultFilter);
  const [isSaving, setIsSaving] = useState(false);

  const selected = useMemo(
    () => pages.find((page) => page.id === selectedPageId) ?? pages[0],
    [pages, selectedPageId]
  );

  const updatePage = (updates: Partial<ScanPage>) => {
    if (!selected) return;
    const nextPages = pages.map((page) => (page.id === selected.id ? { ...page, ...updates } : page));
    onPagesChange(nextPages);
  };

  const handleAddPage = () => {
    const sample: ScanPage = {
      id: `${Date.now()}-page`,
      uri: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=1600&fit=crop',
      filter: 'Auto Enhance',
      brightness: 100,
      contrast: 100,
      rotation: 0,
      width: 1200,
      height: 1600,
      ocrText: 'Additional page captured for the current document. Text here is a preview.',
      corners: [
        { x: 0.15, y: 0.15 },
        { x: 0.85, y: 0.15 },
        { x: 0.88, y: 0.82 },
        { x: 0.12, y: 0.82 },
      ],
    };
    const nextPages = [...pages, sample];
    onPagesChange(nextPages);
    setSelectedPageId(sample.id);
  };

  const handleDeletePage = () => {
    if (pages.length <= 1) {
      Alert.alert('Cannot delete', 'A document must have at least one page.');
      return;
    }
    const nextPages = pages.filter((page) => page.id !== selected?.id);
    onPagesChange(nextPages);
    setSelectedPageId(nextPages[0]?.id ?? '');
  };

  const handleReorderPages = (pageId: string, direction: 'up' | 'down') => {
    const idx = pages.findIndex((p) => p.id === pageId);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === pages.length - 1)) return;

    const nextPages = [...pages];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [nextPages[idx], nextPages[swapIdx]] = [nextPages[swapIdx], nextPages[idx]];
    onPagesChange(nextPages);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Document name required', 'Please enter a document name before saving.');
      return;
    }
    setIsSaving(true);
    try {
      onSave(name, pages);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Document Details</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Document name"
          placeholderTextColor={theme.colors.muted}
          style={[
            styles.input,
            { color: theme.colors.text, backgroundColor: theme.colors.card, borderColor: theme.colors.border },
          ]}
        />

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Filters</Text>
        <View style={styles.filterRow}>
          {FILTERS.map((item) => (
            <FilterPill
              key={item}
              label={item}
              selected={filter === item}
              onPress={() => {
                setFilter(item);
                updatePage({ filter: item as any });
              }}
            />
          ))}
        </View>

        {selected ? (
          <View style={[styles.previewCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Image source={{ uri: selected.uri }} style={styles.previewImage} resizeMode="cover" />
            <Text style={[styles.pageLabel, { color: theme.colors.text }]}>
              Page {pages.findIndex((p) => p.id === selected.id) + 1} of {pages.length}
            </Text>
          </View>
        ) : null}

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Adjustments</Text>
        <View style={styles.sliderFrame}>
          <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: '600' }}>Brightness: {selected?.brightness ?? 100}%</Text>
          <TextInput
            keyboardType="numeric"
            value={String(selected?.brightness ?? 100)}
            onChangeText={(value) => updatePage({ brightness: Number(value) || 100 })}
            style={[
              styles.smallInput,
              { color: theme.colors.text, backgroundColor: theme.colors.card, borderColor: theme.colors.border },
            ]}
          />
        </View>

        <View style={styles.sliderFrame}>
          <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: '600' }}>Contrast: {selected?.contrast ?? 100}%</Text>
          <TextInput
            keyboardType="numeric"
            value={String(selected?.contrast ?? 100)}
            onChangeText={(value) => updatePage({ contrast: Number(value) || 100 })}
            style={[
              styles.smallInput,
              { color: theme.colors.text, backgroundColor: theme.colors.card, borderColor: theme.colors.border },
            ]}
          />
        </View>

        <View style={styles.actionRow}>
          <ActionButton
            label="Rotate Left"
            onPress={() => updatePage({ rotation: (selected?.rotation ?? 0) - 90 })}
            variant="secondary"
          />
          <ActionButton
            label="Rotate Right"
            onPress={() => updatePage({ rotation: (selected?.rotation ?? 0) + 90 })}
            variant="secondary"
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Pages ({pages.length})</Text>
        <View style={styles.pageList}>
          {pages.map((page, idx) => (
            <TouchableOpacity
              key={page.id}
              onPress={() => setSelectedPageId(page.id)}
              style={[
                styles.pageItem,
                { backgroundColor: selectedPageId === page.id ? theme.colors.primary : theme.colors.card, borderColor: theme.colors.border },
              ]}
            >
              <Image source={{ uri: page.uri }} style={styles.pageThumbnail} resizeMode="cover" />
              <Text style={[styles.pageNumber, { color: selectedPageId === page.id ? '#ffffff' : theme.colors.text }]}>
                {idx + 1}
              </Text>
              <View style={styles.pageActions}>
                <TouchableOpacity onPress={() => handleReorderPages(page.id, 'up')} disabled={idx === 0}>
                  <Text style={{ color: idx === 0 ? theme.colors.muted : theme.colors.primary, fontSize: 16 }}>↑</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleReorderPages(page.id, 'down')} disabled={idx === pages.length - 1}>
                  <Text style={{ color: idx === pages.length - 1 ? theme.colors.muted : theme.colors.primary, fontSize: 16 }}>↓</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionRow}>
          <ActionButton label="Add Page" onPress={handleAddPage} variant="secondary" />
          <ActionButton label="Delete Page" onPress={handleDeletePage} variant="secondary" />
        </View>

        {ocrEnabled && selected ? (
          <View style={[styles.ocrCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>OCR Text</Text>
            <Text style={[styles.ocrText, { color: theme.colors.muted }]}>{selected.ocrText}</Text>
          </View>
        ) : null}

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Export Settings</Text>
        <Text style={[styles.setting, { color: theme.colors.muted }]}>PDF Quality: {pdfQuality}</Text>
        <Text style={[styles.setting, { color: theme.colors.muted }]}>Total Pages: {pages.length}</Text>
      </ScrollView>

      <View style={styles.footer}>
        <ActionButton label="Cancel" onPress={onBack} variant="secondary" />
        <ActionButton label={isSaving ? 'Saving...' : activeDocumentId ? 'Save Changes' : 'Save to Library'} onPress={handleSave} disabled={isSaving} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 116,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 12,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 10,
  },
  smallInput: {
    minHeight: 42,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  previewCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: 260,
  },
  pageLabel: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlign: 'center',
  },
  sliderFrame: {
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  pageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  pageItem: {
    width: 'calc(33% - 7px)',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  pageThumbnail: {
    width: '100%',
    height: 80,
  },
  pageNumber: {
    fontSize: 12,
    fontWeight: '700',
    padding: 4,
    textAlign: 'center',
  },
  pageActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  ocrCard: {
    borderWidth: 1,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 16,
    padding: 12,
  },
  ocrText: {
    fontSize: 13,
    lineHeight: 20,
  },
  setting: {
    fontSize: 13,
    marginBottom: 6,
  },
  footer: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 24,
    flexDirection: 'row',
    gap: 12,
  },
});
