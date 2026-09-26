import React from 'react';
import { StyleSheet, View } from 'react-native';
import { getTheme } from '../theme';
import { useAppStore } from '../store/appStore';

export const ScannerOverlay = () => {
  const { settings } = useAppStore();
  const theme = getTheme(settings.theme);

  return (
    <View pointerEvents="none" style={styles.overlayContainer}>
      <View style={[styles.frame, { borderColor: theme.colors.primary }]}>
        <View style={[styles.corner, styles.topLeft, { borderColor: theme.colors.primary }]} />
        <View style={[styles.corner, styles.topRight, { borderColor: theme.colors.primary }]} />
        <View style={[styles.corner, styles.bottomLeft, { borderColor: theme.colors.primary }]} />
        <View style={[styles.corner, styles.bottomRight, { borderColor: theme.colors.primary }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: '78%',
    height: '58%',
    borderWidth: 3,
    borderRadius: 18,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
});
