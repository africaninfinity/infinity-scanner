# Infinity Scanner

Infinity Scanner is a mobile-first document scanning app built with React Native and Expo. It allows users to scan documents, enhance them, combine multiple pages, and export the result as PDF or image.

## Features

- Home dashboard with recent documents and search
- Camera scanner with permission handling and detection overlay
- Document enhancement filters and adjustments
- Multi-page document workflow
- PDF export and image sharing
- Local document library with rename and delete
- Settings for theme, PDF quality, auto detection, and OCR

## Tech stack

- React Native + Expo
- TypeScript
- Zustand for app state
- AsyncStorage for persistence
- expo-camera, expo-media-library, expo-print, expo-sharing

## Getting started

1. Install dependencies:
   npm install
2. Start the app:
   npx expo start
3. Run on device or emulator:
   npx expo run:android
   npx expo run:ios

## Required native permissions

- Camera permission for scanning
- Photo library access for saving images
- Photo library write permission for export/save flows

## Notes

This project is structured for production-ready behavior and can be extended with real OCR and edge-detection libraries when needed on native devices.
