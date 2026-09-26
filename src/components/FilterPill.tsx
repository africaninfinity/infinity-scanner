import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { getTheme } from '../theme';
import { useAppStore } from '../store/appStore';
import { FilterType } from '../types';

type FilterPillProps = {
  label: FilterType;
  selected: boolean;
  onPress: () => void;
};

export const FilterPill = ({ label, selected, onPress }: FilterPillProps) => {
  const { settings } = useAppStore();
  const theme = getTheme(settings.theme);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        {
          backgroundColor: selected ? theme.colors.primary : theme.colors.card,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
        },
      ]}
    >
      <Text style={[styles.label, { color: selected ? '#ffffff' : theme.colors.text }]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});
