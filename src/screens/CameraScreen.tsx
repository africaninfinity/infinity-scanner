import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { getTheme } from '../theme';
import { useAppStore } from '../store/appStore';
import { ScannerOverlay } from '../components/ScannerOverlay';
import { ActionButton } from '../components/ActionButton';

type CameraScreenProps = {
  onCapture: (uri: string) => void;
  onBack: () => void;
  autoEdgeDetection: boolean;
};

export const CameraScreen = ({ onCapture, onBack, autoEdgeDetection }: CameraScreenProps) => {
  const { settings } = useAppStore();
  const theme = getTheme(settings.theme);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleCapture = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Camera access required', 'Please enable camera permissions to scan documents.');
        return;
      }
    }

    try {
      const photo = await Camera.getCameraPermissionsAsync();
      if (photo.granted && cameraReady) {
        const photoRef = await (global as any).cameraRef?.takePictureAsync({ quality: 0.8 });
        if (photoRef?.uri) {
          onCapture(photoRef.uri);
        }
      }
    } catch (error) {
      Alert.alert('Capture failed', 'The camera could not process the image.');
    }
  };

  if (!permission) {
    return <View style={[styles.centered, { backgroundColor: theme.colors.background }]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Camera permission required</Text>
        <Text style={[styles.subtitle, { color: theme.colors.muted }]}>Please enable the camera to scan documents.</Text>
        <ActionButton label="Allow Camera" onPress={() => requestPermission()} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <Camera
        style={StyleSheet.absoluteFillObject}
        type={CameraType.back}
        onCameraReady={() => setCameraReady(true)}
        ref={(ref) => {
          (global as any).cameraRef = ref;
        }}
      />

      <ScannerOverlay />

      <View style={styles.topBar}>
        <Pressable onPress={onBack} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <Text style={styles.statusText}>{autoEdgeDetection ? 'Auto detect active' : 'Manual capture mode'}</Text>
      </View>

      <View style={styles.bottomBar}>
        <ActionButton label="Capture" onPress={handleCapture} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 18,
  },
  topBar: {
    position: 'absolute',
    top: 28,
    left: 18,
    right: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 28,
    left: 24,
    right: 24,
  },
});
