import React, { useEffect, useRef, useState } from 'react';
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
  const cameraRef = useRef<Camera>(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleCapture = async () => {
    if (isCapturing) return;
    
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Camera access required', 'Please enable camera permissions to scan documents.');
        return;
      }
    }

    if (!cameraReady || !cameraRef.current) {
      Alert.alert('Camera not ready', 'Please wait for camera to initialize.');
      return;
    }

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo?.uri) {
        onCapture(photo.uri);
      }
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Capture failed', 'The camera could not process the image.');
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Camera permission required</Text>
        <Text style={[styles.subtitle, { color: theme.colors.muted }]}>Please enable the camera to scan documents.</Text>
        <View style={styles.buttonContainer}>
          <ActionButton label="Allow Camera" onPress={() => requestPermission()} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <Camera
        style={StyleSheet.absoluteFillObject}
        type={CameraType.back}
        onCameraReady={() => setCameraReady(true)}
        ref={cameraRef}
      />

      <ScannerOverlay />

      <View style={styles.topBar}>
        <Pressable onPress={onBack} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <Text style={styles.statusText}>{autoEdgeDetection ? 'Auto detect' : 'Manual mode'}</Text>
      </View>

      <View style={styles.bottomBar}>
        <ActionButton label={isCapturing ? 'Capturing...' : 'Capture'} onPress={handleCapture} disabled={isCapturing || !cameraReady} />
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
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 18,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 12,
  },
  topBar: {
    position: 'absolute',
    top: 28,
    left: 18,
    right: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
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
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 28,
    left: 24,
    right: 24,
    zIndex: 10,
  },
});
