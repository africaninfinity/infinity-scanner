import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getTheme } from '../theme';
import { useAppStore } from '../store/appStore';
import { DocumentEntry } from '../types';
import { formatDocumentDate } from '../lib/document';

type DocumentCardProps = {
  document: DocumentEntry;
  onPress: () => void;
};

export const DocumentCard = ({ document, onPress }: DocumentCardProps) => {
  const { settings } = useAppStore();
  const theme = getTheme(settings.theme);
  const imageSource = document.pages[0]?.uri ?? '';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      activeOpacity={0.7}
    >
      {imageSource ? (
        <Image source={{ uri: imageSource }} style={styles.thumb} resizeMode="cover" />
      ) : (
        <View style={[styles.thumb, { backgroundColor: theme.colors.border }]} />
      )}

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
          {document.name}
        </Text>
        <Text style={[styles.meta, { color: theme.colors.muted }]}>
          {formatDocumentDate(document.createdAt)} • {document.pageCount} page{document.pageCount !== 1 ? 's' : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  thumb: {
    width: 100,
    height: 100,
    backgroundColor: '#dfe6ef',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
  },
});
