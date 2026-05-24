import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, TrendingUp, Lightbulb, CheckCircle } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { GradeRing } from '@/components/GradeRing';
import { TipCard } from '@/components/TipCard';
import { useAppStore } from '@/lib/store';
import { IMPROVEMENT_TIPS, PAST_ASSESSMENTS } from '@/lib/demo-data';
import { colors, getGradeColor } from '@/lib/theme';
import type { FeatureGrade } from '@/lib/types';

export default function FeatureDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const currentAssessment = useAppStore((s) => s.currentAssessment);

  const feature = useMemo(() =>
    currentAssessment?.features.find((f) => f.id === id) ?? null,
    [currentAssessment, id]
  );

  const relatedTips = useMemo(() =>
    IMPROVEMENT_TIPS.filter((t) => t.featureId === id),
    [id]
  );

  // Feature progress over assessments
  const progressHistory = useMemo(() =>
    PAST_ASSESSMENTS.map((a) => {
      const f = a.features.find((feat) => feat.id === id);
      return { date: a.date, score: f?.score ?? 0 };
    }).slice(-5),
    [id]
  );

  if (!feature) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0f', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#f1f1f4' }}>Feature not found</Text>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          testID="back-not-found"
          style={{ marginTop: 16, backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 }}
        >
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#fff' }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const gradeColor = getGradeColor(feature.grade);

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0f' }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          testID="feature-back"
          hitSlop={10}
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}
        >
          <ArrowLeft size={18} color="#f1f1f4" />
        </Pressable>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: '#f1f1f4', flex: 1 }}>{feature.name}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 40 }} showsVerticalScrollIndicator={false}>
        {/* Grade hero */}
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <GradeRing grade={feature.grade} score={feature.score} size={120} strokeWidth={8} showScore />
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: gradeColor, marginTop: 12 }}>
            {feature.grade} Grade
          </Text>
        </View>

        {/* Description */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#f1f1f4', marginBottom: 8 }}>Analysis</Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 22 }}>
              {feature.description}
            </Text>
          </View>
        </View>

        {/* Mini progress */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <TrendingUp size={14} color={colors.primary} />
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#f1f1f4' }}>Score History</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 80, paddingHorizontal: 4 }}>
              {progressHistory.map((entry, idx) => {
                const maxH = 60;
                const barH = Math.max(6, (entry.score / 100) * maxH);
                const isLast = idx === progressHistory.length - 1;
                return (
                  <View key={idx} style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 10, color: isLast ? colors.primary : 'rgba(255,255,255,0.35)', marginBottom: 4 }}>
                      {entry.score}
                    </Text>
                    <View style={{
                      width: 20,
                      height: barH,
                      borderRadius: 6,
                      backgroundColor: isLast ? colors.primary : 'rgba(255,255,255,0.1)',
                    }} />
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 8, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Quick tips */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Lightbulb size={14} color="#eab308" />
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#f1f1f4' }}>Quick Tips</Text>
            </View>
            {feature.tips.map((tip, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: idx < feature.tips.length - 1 ? 10 : 0 }}>
                <CheckCircle size={14} color="rgba(255,255,255,0.2)" style={{ marginTop: 2, marginRight: 8 }} />
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.6)', flex: 1, lineHeight: 19 }}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Detailed improvement plan */}
        {relatedTips.length > 0 ? (
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: '#f1f1f4', marginBottom: 12 }}>Detailed Plan</Text>
            {relatedTips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
