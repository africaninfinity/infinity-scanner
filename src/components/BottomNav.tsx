import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getTheme } from '../theme';
import { useAppStore } from '../store/appStore';

type BottomNavProps = {
  active: string;
  onHome: () => void;
  onLibrary: () => void;
  onScanner: () => void;
  onSettings: () => void;
};

export const BottomNav = ({ active, onHome, onLibrary, onScanner, onSettings }: BottomNavProps) => {
  const { settings } = useAppStore();
  const theme = getTheme(settings.theme);

  const items = [
    { key: 'home', label: 'Home', onPress: onHome },
    { key: 'library', label: 'Library', onPress: onLibrary },
    { key: 'camera', label: 'Scan', onPress: onScanner },
    { key: 'settings', label: 'Settings', onPress: onSettings },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
      {items.map((item) => {
        const isActive = item.key === active;
        return (
          <Pressable
            key={item.key}
            onPress={item.onPress}
            style={[styles.tab, isActive && { backgroundColor: theme.colors.primary }]}
          >
            <Text style={[styles.label, { color: isActive ? '#ffffff' : theme.colors.text }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    minHeight: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
