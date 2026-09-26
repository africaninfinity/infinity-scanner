import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
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

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>

        <SectionCard title="Appearance">
          <View style={styles.row}>
            <Text style={{ color: theme.colors.text }}>Theme</Text>
            <Switch
              value={settings.theme === 'dark'}
              onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
            />
          </View>
        </SectionCard>

        <SectionCard title="Scanning">
          <View style={styles.row}>
            <Text style={{ color: theme.colors.text }}>Default scan filter</Text>
            <Text style={{ color: theme.colors.muted }}>{settings.defaultFilter}</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ color: theme.colors.text }}>PDF quality</Text>
            <Text style={{ color: theme.colors.muted }}>{settings.pdfQuality}</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ color: theme.colors.text }}>Auto edge detection</Text>
            <Switch
              value={settings.autoEdgeDetection}
              onValueChange={(value) => updateSettings({ autoEdgeDetection: value })}
            />
          </View>
          <View style={styles.row}>
            <Text style={{ color: theme.colors.text }}> OCR</Text>
            <Switch
              value={settings.ocrEnabled}
              onValueChange={(value) => updateSettings({ ocrEnabled: value })}
            />
          </View>
        </SectionCard>

        <SectionCard title="About">
          <Text style={{ color: theme.colors.muted, lineHeight: 20 }}>
            Infinity Scanner provides a clean, mobile-first scanning workflow for physical documents, notes, forms, and receipts.
          </Text>
        </SectionCard>

        <SectionCard title="Privacy">
          <Text style={{ color: theme.colors.muted, lineHeight: 20 }}>
            Documents are stored locally on the device. No cloud upload is required for the core scanning workflow.
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
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  footer: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 22,
  },
});
