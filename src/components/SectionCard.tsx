import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getTheme } from '../theme';
import { useAppStore } from '../store/appStore';

type SectionCardProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export const SectionCard = ({ title, subtitle, children }: SectionCardProps) => {
  const { settings } = useAppStore();
  const theme = getTheme(settings.theme);

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: theme.colors.muted }]}>{subtitle}</Text> : null}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 10,
  },
});
