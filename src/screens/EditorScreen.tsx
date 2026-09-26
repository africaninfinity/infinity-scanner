import React, { useMemo, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
  const [selectedPage, setSelectedPage] = useState<string>(pages[0]?.id ?? '');
  const [filter, setFilter] = useState<string>(defaultFilter);

  const selected = useMemo(
    () => pages.find((page) => page.id === selectedPage) ?? pages[0],
    [pages, selectedPage]
  );

  const updatePage = (updates: Partial<ScanPage>) => {
    if (!selected) return;
    const nextPages = pages.map((page) => (page.id === selected.id ? { ...page, ...updates } : page));
    onPagesChange(nextPages);
  };

  const handleAddPage = () => {
    const sample: ScanPage = {
      id: `${Date.now()}-page`,
      uri: 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
      filter: 'Auto Enhance',
      brightness: 100,
      contrast: 100,
      rotation: 0,
      width: 1200,
      height: 1600,
      ocrText: 'Additional page captured for the current document.',
      corners: [
        { x: 0.15, y: 0.15 },
        { x: 0.85, y: 0.15 },
        { x: 0.88, y: 0.82 },
        { x: 0.12, y: 0.82 },
      ],
    };
    const nextPages = [...pages, sample];
    onPagesChange(nextPages);
    setSelectedPage(sample.id);
  };

  const handleDeletePage = () => {
    if (pages.length <= 1) {
      Alert.alert('Cannot delete the only page');
      return;
    }
    const nextPages = pages.filter((page) => page.id !== selected?.id);
    onPagesChange(nextPages);
    setSelectedPage(nextPages[0]?.id ?? '');
  };

  const exportPdf = () => {
    onSave(name, pages);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Document details</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Document name"
          placeholderTextColor={theme.colors.muted}
          style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
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
          </View>
        ) : null}

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Adjustments</Text>
        <View style={styles.sliderFrame}>
          <Text style={{ color: theme.colors.text }}>Brightness: {selected?.brightness ?? 100}%</Text>
          <TextInput
            keyboardType="numeric"
            value={String(selected?.brightness ?? 100)}
            onChangeText={(value) => updatePage({ brightness: Number(value) || 100 })}
            style={[styles.smallInput, { color: theme.colors.text, backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          />
        </View>

        <View style={styles.sliderFrame}>
          <Text style={{ color: theme.colors.text }}>Contrast: {selected?.contrast ?? 100}%</Text>
          <TextInput
            keyboardType="numeric"
            value={String(selected?.contrast ?? 100)}
            onChangeText={(value) => updatePage({ contrast: Number(value) || 100 })}
            style={[styles.smallInput, { color: theme.colors.text, backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          />
        </View>

        <View style={styles.actionRow}>
          <ActionButton label="Rotate Left" onPress={() => updatePage({ rotation: (selected?.rotation ?? 0) - 90 })} variant="secondary" />
          <ActionButton label="Rotate Right" onPress={() => updatePage({ rotation: (selected?.rotation ?? 0) + 90 })} variant="secondary" />
        </View>

        <View style={styles.actionRow}>
          <ActionButton label="Add Page" onPress={handleAddPage} variant="secondary" />
          <ActionButton label="Delete Page" onPress={handleDeletePage} variant="secondary" />
        </View>

        {ocrEnabled && selected ? (
          <View style={[styles.ocrCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>OCR Extracted Text</Text>
            <Text style={[styles.ocrText, { color: theme.colors.muted }]}>{selected.ocrText}</Text>
          </View>
        ) : null}

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>PDF Quality: {pdfQuality}</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Pages: {pages.length}</Text>
      </ScrollView>

      <View style={styles.footer}>
        <ActionButton label="Back" onPress={onBack} variant="secondary" />
        <ActionButton label={activeDocumentId ? 'Save Changes' : 'Save to Library'} onPress={exportPdf} />
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
  sliderFrame: {
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
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
  footer: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 24,
    flexDirection: 'row',
    gap: 12,
  },
});
