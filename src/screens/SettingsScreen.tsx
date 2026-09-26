import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { getTheme } from '../theme';
import { useAppStore } from '../store/appStore';
import { ActionButton } from '../components/ActionButton';
import { SectionCard } from '../components/SectionCard';

type SettingsScreenProps = {
  onBack: () => void;
};

export const SettingsScreen = ({ onBack }: SettingsScreenProps) => {
  const { settings, updateSettings, setTheme } = useAppStore();
  const theme = getTheme(settings.theme);

  const handlePdfQuality = () => {
    const options = ['Draft', 'Balanced', 'High'];
    const current = options.indexOf(settings.pdfQuality);
    const next = options[(current + 1) % options.length];
    updateSettings({ pdfQuality: next as 'Draft' | 'Balanced' | 'High' });
  };

  const handleDefaultFilter = () => {
    const filters = ['Original', 'Auto Enhance', 'Black & White', 'Grayscale', 'Color', 'Document', 'High Contrast'];
    const current = filters.indexOf(settings.defaultFilter);
    const next = filters[(current + 1) % filters.length];
    updateSettings({ defaultFilter: next as any });
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={{ color: theme.colors.primary, fontSize: 18, fontWeight: '700' }}>← Back</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <SectionCard title="Appearance">
          <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
            <Text style={{ color: theme.colors.text, fontSize: 15, flex: 1 }}>Theme</Text>
            <Switch value={settings.theme === 'dark'} onValueChange={(value) => setTheme(value ? 'dark' : 'light')} />
          </View>
        </SectionCard>

        <SectionCard title="Scanning">
          <Pressable onPress={handleDefaultFilter} style={[styles.row, { borderBottomColor: theme.colors.border }]}>
            <Text style={{ color: theme.colors.text, fontSize: 15, flex: 1 }}>Default filter</Text>
            <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>{settings.defaultFilter}</Text>
          </Pressable>

          <Pressable onPress={handlePdfQuality} style={[styles.row, { borderBottomColor: theme.colors.border }]}>
            <Text style={{ color: theme.colors.text, fontSize: 15, flex: 1 }}>PDF quality</Text>
            <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>{settings.pdfQuality}</Text>
          </Pressable>

          <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
            <Text style={{ color: theme.colors.text, fontSize: 15, flex: 1 }}>Auto edge detection</Text>
            <Switch
              value={settings.autoEdgeDetection}
              onValueChange={(value) => updateSettings({ autoEdgeDetection: value })}
            />
          </View>

          <View style={styles.row}>
            <Text style={{ color: theme.colors.text, fontSize: 15, flex: 1 }}>OCR enabled</Text>
            <Switch value={settings.ocrEnabled} onValueChange={(value) => updateSettings({ ocrEnabled: value })} />
          </View>
        </SectionCard>

        <SectionCard title="About">
          <Text style={{ color: theme.colors.muted, lineHeight: 20, fontSize: 14 }}>
            Infinity Scanner v1.0.0
          </Text>
          <Text style={{ color: theme.colors.muted, lineHeight: 20, fontSize: 13, marginTop: 10 }}>
            A modern mobile document scanner for capturing, enhancing, and exporting documents as PDF or image.
          </Text>
          <Text style={{ color: theme.colors.muted, lineHeight: 20, fontSize: 13, marginTop: 10 }}>
            Documents are stored locally on your device. No cloud upload required.
          </Text>
        </SectionCard>

        <SectionCard title="Privacy">
          <Text style={{ color: theme.colors.muted, lineHeight: 20, fontSize: 13 }}>
            Camera access is required to capture documents. Photo library access is used to save scans to your device.
          </Text>
          <Text style={{ color: theme.colors.muted, lineHeight: 20, fontSize: 13, marginTop: 10 }}>
            All document data is stored locally. No information is sent to any server.
          </Text>
        </SectionCard>
      </ScrollView>

      <View style={styles.footer}>
        <ActionButton label="Back" onPress={onBack} variant="secondary" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    paddingBottom: 120,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  footer: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 22,
  },
});
