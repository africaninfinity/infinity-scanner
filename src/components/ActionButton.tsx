import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getTheme } from '../theme';
import { useAppStore } from '../store/appStore';

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
};

export const ActionButton = ({ label, onPress, variant = 'primary', disabled = false }: ActionButtonProps) => {
  const { settings } = useAppStore();
  const theme = getTheme(settings.theme);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor:
            variant === 'primary'
              ? theme.colors.primary
              : variant === 'secondary'
                ? theme.colors.card
                : 'transparent',
          borderColor: variant === 'secondary' ? theme.colors.border : 'transparent',
          opacity: disabled ? 0.6 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: variant === 'primary' ? '#ffffff' : theme.colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
});
