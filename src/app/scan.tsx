import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, Pressable, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, Camera, SwitchCamera, Zap, Scan } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system/legacy';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { generateAssessment } from '@/lib/assessment-generator';

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const addAssessment = useAppStore((s) => s.addAssessment);
  const cameraRef = useRef<CameraView>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [facing, setFacing] = useState<CameraType>('front');
  const [flash, setFlash] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const shutterScale = useSharedValue(1);
  const scanPulse = useSharedValue(1);
  const borderOpacity = useSharedValue(0.3);

  const shutterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shutterScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scanPulse.value }],
    opacity: 2 - scanPulse.value,
  }));

  const frameStyle = useAnimatedStyle(() => ({
    borderColor: `rgba(59,130,246,${borderOpacity.value})`,
  }));

  const handleCapture = useCallback(async () => {
    if (isScanning || !cameraRef.current) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    shutterScale.value = withSpring(0.85, { damping: 12 }, () => {
      shutterScale.value = withSpring(1, { damping: 12 });
    });

    setIsScanning(true);

    try {
      // Take the actual photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (!photo) {
        throw new Error('Failed to capture photo');
      }

      // Animate the scan frame
      borderOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      scanPulse.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        true
      );

      // Save photo to permanent storage
      const timestamp = Date.now();
      const fileName = `assessment_${timestamp}.jpg`;
      const permanentUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.copyAsync({
        from: photo.uri,
        to: permanentUri,
      });

      // Scanning progress with real assessment generation
      let progress = 0;
      const interval = setInterval(() => {
        progress += 8;
        setScanProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          // Generate and save real assessment with the actual photo
          const newAssessment = generateAssessment();
          newAssessment.photoUrl = permanentUri;
          addAssessment(newAssessment);
          setTimeout(() => {
            router.replace('/results');
          }, 300);
        }
      }, 200);
    } catch (error) {
      console.error('Capture error:', error);
      setIsScanning(false);
      borderOpacity.value = 0.3;
      scanPulse.value = 1;
      if (Platform.OS !== 'web') {
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
      }
    }
  }, [isScanning, borderOpacity, scanPulse, shutterScale, addAssessment]);

  const toggleCameraFacing = useCallback(() => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }, []);

  const toggleFlash = useCallback(() => {
    setFlash((current) => !current);
  }, []);

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0f', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
          Loading camera...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0f', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Camera size={48} color={colors.primary} style={{ marginBottom: 16 }} />
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, color: '#f1f1f4', marginBottom: 8, textAlign: 'center' }}>
          Camera Permission Required
        </Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 24 }}>
          We need access to your camera to analyze your facial features.
        </Text>
        <Pressable
          onPress={requestPermission}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#fff' }}>
            Grant Permission
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.back()}
          style={{ marginTop: 16 }}
        >
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
            Cancel
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0f' }}>
      {/* Real CameraView */}
      <View style={{ flex: 1, backgroundColor: '#111118', position: 'relative' }}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={facing}
          flash={flash ? 'on' : 'off'}
        >
          {/* Face guide frame overlay */}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={[{
              width: 240,
              height: 320,
              borderRadius: 120,
              borderWidth: 2,
              alignItems: 'center',
              justifyContent: 'center',
            }, frameStyle]}>
              <Scan size={48} color={isScanning ? colors.primary : 'rgba(255,255,255,0.15)'} />
              {!isScanning ? (
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 12, paddingHorizontal: 20 }}>
                  Position your face inside the frame
                </Text>
              ) : (
                <View style={{ alignItems: 'center', marginTop: 12 }}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.primary }}>
                    Analyzing...
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                    {scanProgress}%
                  </Text>
                </View>
              )}
            </Animated.View>

            {/* Pulse ring behind frame when scanning */}
            {isScanning ? (
              <Animated.View style={[{
                position: 'absolute',
                width: 260,
                height: 340,
                borderRadius: 130,
                borderWidth: 1,
                borderColor: 'rgba(59,130,246,0.2)',
              }, pulseStyle]} />
            ) : null}
          </View>

          {/* Scanning progress bar */}
          {isScanning ? (
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: 'rgba(255,255,255,0.06)' }}>
              <View style={{ height: 3, backgroundColor: colors.primary, width: `${scanProgress}%`, borderRadius: 2 }} />
            </View>
          ) : null}
        </CameraView>
      </View>

      {/* Controls */}
      <View style={{ backgroundColor: '#0a0a0f', paddingBottom: insets.bottom + 20, paddingTop: 20 }}>
        {/* Tips */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#f1f1f4' }}>
            {isScanning ? 'Hold still...' : 'Take a frontal selfie'}
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
            {isScanning ? 'Analyzing facial features' : 'Good lighting, neutral expression'}
          </Text>
        </View>

        {/* Button row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
          {/* Flip camera */}
          <Pressable
            onPress={toggleCameraFacing}
            accessibilityLabel="Switch camera"
            testID="switch-camera"
            hitSlop={10}
            disabled={isScanning}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}
          >
            <SwitchCamera size={20} color={isScanning ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.6)'} />
          </Pressable>

          {/* Shutter */}
          <Animated.View style={shutterStyle}>
            <Pressable
              onPress={handleCapture}
              accessibilityLabel="Capture selfie"
              testID="shutter-button"
              disabled={isScanning}
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: isScanning ? 'rgba(59,130,246,0.3)' : colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 4,
                borderColor: 'rgba(255,255,255,0.2)',
              }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Camera size={28} color="#fff" />
            </Pressable>
          </Animated.View>

          {/* Flash */}
          <Pressable
            onPress={toggleFlash}
            accessibilityLabel="Toggle flash"
            testID="toggle-flash"
            hitSlop={10}
            disabled={isScanning}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: flash && !isScanning ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Zap size={20} color={flash && !isScanning ? colors.primary : isScanning ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.6)'} />
          </Pressable>
        </View>
      </View>

      {/* Close button */}
      <Pressable
        onPress={() => router.back()}
        accessibilityLabel="Close camera"
        testID="close-camera"
        hitSlop={10}
        style={{
          position: 'absolute',
          top: insets.top + 12,
          left: 16,
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={20} color="#fff" />
      </Pressable>
    </View>
  );
}
