import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Share2, Camera } from 'lucide-react-native';
import { GradeRing } from '@/components/GradeRing';
import { FeatureCard } from '@/components/FeatureCard';
import { useAppStore } from '@/lib/store';
import { colors, getGradeColor } from '@/lib/theme';

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const currentAssessment = useAppStore((s) => s.currentAssessment);

  if (!currentAssessment) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0f', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <Camera size={48} color="rgba(255,255,255,0.15)" />
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, color: '#f1f1f4', marginTop: 16 }}>No Assessment Yet</Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 8 }}>
          Take your first face scan to get your grades
        </Text>
        <Pressable
          onPress={() => router.push('/scan')}
          accessibilityLabel="Start face scan"
          testID="start-scan-empty"
          style={{ backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 20 }}
        >
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#fff' }}>Start Scan</Text>
        </Pressable>
      </View>
    );
  }

  const sortedFeatures = [...currentAssessment.features].sort((a, b) => b.score - a.score);
  const topFeatures = sortedFeatures.filter((f) => f.score >= 75);
  const midFeatures = sortedFeatures.filter((f) => f.score >= 55 && f.score < 75);
  const weakFeatures = sortedFeatures.filter((f) => f.score < 55);

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0f' }}>
      {/* Fixed header */}
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          testID="results-back"
          hitSlop={10}
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={18} color="#f1f1f4" />
        </Pressable>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: '#f1f1f4' }}>Assessment Results</Text>
        <Pressable
          accessibilityLabel="Share results"
          testID="share-results"
          hitSlop={10}
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Share2 size={16} color="rgba(255,255,255,0.5)" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall grade hero */}
        <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 28 }}>
          <GradeRing grade={currentAssessment.overallGrade} score={currentAssessment.overallScore} size={140} strokeWidth={8} showScore />
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 12 }}>Overall Rating</Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
            Based on 8 facial features analyzed
          </Text>
        </View>

        {/* Grade distribution bar */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>Grade Distribution</Text>
            <View style={{ flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden' }}>
              {topFeatures.length > 0 ? (
                <View style={{ flex: topFeatures.length, backgroundColor: colors.gradeA, borderRadius: 4, marginRight: 2 }} />
              ) : null}
              {midFeatures.length > 0 ? (
                <View style={{ flex: midFeatures.length, backgroundColor: colors.gradeC, borderRadius: 4, marginRight: 2 }} />
              ) : null}
              {weakFeatures.length > 0 ? (
                <View style={{ flex: weakFeatures.length, backgroundColor: colors.gradeF, borderRadius: 4 }} />
              ) : null}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gradeA }} />
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Strong ({topFeatures.length})</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gradeC }} />
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Average ({midFeatures.length})</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gradeF }} />
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Weak ({weakFeatures.length})</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Features list */}
        <View style={{ paddingHorizontal: 20 }}>
          {topFeatures.length > 0 ? (
            <>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.gradeA, marginBottom: 10 }}>STRENGTHS</Text>
              {topFeatures.map((f) => (
                <FeatureCard key={f.id} feature={f} onPress={() => router.push(`/feature/${f.id}`)} />
              ))}
              <View style={{ height: 16 }} />
            </>
          ) : null}

          {midFeatures.length > 0 ? (
            <>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.gradeC, marginBottom: 10 }}>AVERAGE</Text>
              {midFeatures.map((f) => (
                <FeatureCard key={f.id} feature={f} onPress={() => router.push(`/feature/${f.id}`)} />
              ))}
              <View style={{ height: 16 }} />
            </>
          ) : null}

          {weakFeatures.length > 0 ? (
            <>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.gradeF, marginBottom: 10 }}>NEEDS WORK</Text>
              {weakFeatures.map((f) => (
                <FeatureCard key={f.id} feature={f} onPress={() => router.push(`/feature/${f.id}`)} />
              ))}
            </>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
