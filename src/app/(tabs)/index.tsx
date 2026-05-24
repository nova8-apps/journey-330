import React from 'react';
import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Camera, ChevronRight, Zap, Flame, ArrowUpRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { GradeRing } from '@/components/GradeRing';
import { FeatureCard } from '@/components/FeatureCard';
import { useAppStore } from '@/lib/store';
import { DEMO_USER, PROGRESS_DATA } from '@/lib/demo-data';
import { colors, getGradeColor } from '@/lib/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const currentAssessment = useAppStore((s) => s.currentAssessment);
  const scanScale = useSharedValue(1);

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scanScale.value }],
  }));

  const handleScan = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    scanScale.value = withSpring(0.95, { damping: 15 }, () => {
      scanScale.value = withSpring(1, { damping: 15 });
    });
    router.push('/scan');
  };

  const topFeatures = currentAssessment?.features.slice(0, 3) ?? [];
  const weakest = currentAssessment?.features
    ? [...currentAssessment.features].sort((a, b) => a.score - b.score).slice(0, 2)
    : [];

  const scoreDelta = PROGRESS_DATA.length >= 2
    ? PROGRESS_DATA[PROGRESS_DATA.length - 1].score - PROGRESS_DATA[PROGRESS_DATA.length - 2].score
    : 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#0a0a0f' }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header — personalized greeting */}
      <View style={{ paddingTop: insets.top, paddingHorizontal: 20, marginBottom: 10 }}>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>
          Welcome back,
        </Text>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 28, color: '#f1f1f4', letterSpacing: -0.5 }}>
          {DEMO_USER.name}
        </Text>
      </View>

      {/* Overall Score Card */}
      {currentAssessment ? (
        <Pressable
          onPress={() => router.push('/results')}
          accessibilityLabel="View full assessment results"
          testID="overall-score-card"
          style={{
            marginHorizontal: 20,
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderRadius: 20,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <GradeRing grade={currentAssessment.overallGrade} score={currentAssessment.overallScore} size={90} showScore />
          <View style={{ flex: 1, marginLeft: 20 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
              Latest Assessment
            </Text>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 20, color: '#f1f1f4', marginBottom: 6 }}>
              Overall Score
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {scoreDelta > 0 ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(34,197,94,0.12)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                  <ArrowUpRight size={12} color="#22c55e" />
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#22c55e', marginLeft: 2 }}>+{scoreDelta}pts</Text>
                </View>
              ) : null}
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>May 24, 2026</Text>
            </View>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.2)" />
        </Pressable>
      ) : null}

      {/* Scan CTA */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <Animated.View style={scanStyle}>
          <Pressable
            onPress={handleScan}
            accessibilityLabel="Start new face scan"
            testID="scan-cta-button"
            style={{
              backgroundColor: colors.primary,
              borderRadius: 16,
              padding: 18,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Camera size={20} color="#fff" />
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#fff', marginLeft: 10 }}>New Face Scan</Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Stats Row */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 24 }}>
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Flame size={14} color="#f97316" />
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginLeft: 6 }}>Streak</Text>
          </View>
          <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 28, color: '#f1f1f4', letterSpacing: -1 }}>
            {DEMO_USER.streakDays}
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>days</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Zap size={14} color="#3b82f6" />
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginLeft: 6 }}>Scans</Text>
          </View>
          <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 28, color: '#f1f1f4', letterSpacing: -1 }}>
            {DEMO_USER.assessmentCount}
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>total</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <ArrowUpRight size={14} color="#22c55e" />
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginLeft: 6 }}>Gained</Text>
          </View>
          <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 28, color: scoreDelta > 0 ? '#22c55e' : scoreDelta < 0 ? '#ef4444' : '#f1f1f4', letterSpacing: -1 }}>
            {scoreDelta > 0 ? '+' : ''}{scoreDelta}
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>points</Text>
        </View>
      </View>

      {/* Top Features — horizontal scroll */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 }}>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: '#f1f1f4' }}>Best Features</Text>
          <Pressable onPress={() => router.push('/results')} accessibilityLabel="View all features" testID="view-all-features" hitSlop={10}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: colors.primary }}>View All</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }} style={{ flexGrow: 0 }}>
          {[...topFeatures].sort((a, b) => b.score - a.score).map((f) => (
            <FeatureCard key={f.id} feature={f} compact onPress={() => router.push(`/feature/${f.id}`)} />
          ))}
        </ScrollView>
      </View>

      {/* Focus Areas */}
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: '#f1f1f4', marginBottom: 12 }}>Focus Areas</Text>
        {weakest.map((f) => (
          <FeatureCard key={f.id} feature={f} onPress={() => router.push(`/feature/${f.id}`)} />
        ))}
      </View>
    </ScrollView>
  );
}
