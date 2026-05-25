import React, { useMemo } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Calendar, TrendingUp, Award, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react-native';
import { ProgressChart } from '@/components/ProgressChart';
import { useAppStore } from '@/lib/store';
import { colors, getGradeColor } from '@/lib/theme';
import type { ProgressEntry } from '@/lib/types';

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const assessments = useAppStore((s) => s.assessments);
  const { width: screenWidth } = useWindowDimensions();

  const sortedAssessments = useMemo(() =>
    [...assessments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [assessments]
  );

  const progressData: ProgressEntry[] = useMemo(() =>
    sortedAssessments.map(a => ({
      date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: a.overallScore,
    })).reverse(),
    [sortedAssessments]
  );

  const latestScore = sortedAssessments[0]?.overallScore ?? 0;
  const firstScore = sortedAssessments[sortedAssessments.length - 1]?.overallScore ?? 0;
  const totalGain = latestScore - firstScore;

  // Empty state when no scans
  if (assessments.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
        <Sparkles size={64} color={colors.primary} style={{ marginBottom: 20 }} />
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 24, color: '#f1f1f4', textAlign: 'center', marginBottom: 10 }}>
          No Progress Yet
        </Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
          Take your first scan to start tracking your journey
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#0a0a0f' }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header — large date card style */}
      <View style={{ paddingTop: insets.top, paddingHorizontal: 20, marginBottom: 4, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Calendar size={14} color={colors.primary} />
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
            Your Journey
          </Text>
        </View>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 26, color: '#f1f1f4', letterSpacing: -0.5, textAlign: 'center' }}>
          Progress Tracker
        </Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 4 }}>
          Last 10 weeks of improvement
        </Text>
      </View>

      {/* Summary stats */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginTop: 14, marginBottom: 18 }}>
        <View style={{ flex: 1, backgroundColor: 'rgba(34,197,94,0.08)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(34,197,94,0.15)' }}>
          <ArrowUpRight size={16} color="#22c55e" />
          <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 28, color: '#22c55e', letterSpacing: -1, marginTop: 6 }}>+{totalGain}</Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(34,197,94,0.7)' }}>Total gained</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'rgba(59,130,246,0.08)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(59,130,246,0.15)' }}>
          <Award size={16} color={colors.primary} />
          <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 28, color: colors.primary, letterSpacing: -1, marginTop: 6 }}>{latestScore}</Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(59,130,246,0.7)' }}>Current score</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 14 }}>
          <TrendingUp size={16} color="rgba(255,255,255,0.5)" />
          <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 28, color: '#f1f1f4', letterSpacing: -1, marginTop: 6 }}>{sortedAssessments.length}</Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Scans taken</Text>
        </View>
      </View>

      {/* Chart */}
      <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16, paddingTop: 12 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#f1f1f4', marginBottom: 12 }}>Score Over Time</Text>
          <ProgressChart data={progressData} width={screenWidth - 72} height={160} />
        </View>
      </View>

      {/* Assessment History */}
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: '#f1f1f4', marginBottom: 12 }}>Assessment History</Text>
        {sortedAssessments.slice(0, 7).map((assessment, idx) => {
          const prevScore = idx < sortedAssessments.length - 1 ? sortedAssessments[idx + 1].overallScore : assessment.overallScore;
          const delta = assessment.overallScore - prevScore;
          const gradeColor = getGradeColor(assessment.overallGrade);

          return (
            <Pressable
              key={assessment.id}
              onPress={() => router.push('/results')}
              accessibilityLabel={`Assessment from ${assessment.date}`}
              testID={`history-${assessment.id}`}
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                borderRadius: 14,
                padding: 14,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 18, color: gradeColor }}>{assessment.overallGrade}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#f1f1f4' }}>
                  Score: {assessment.overallScore}/100
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                  {new Date(assessment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </View>
              {delta !== 0 ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  {delta > 0 ? <ArrowUpRight size={14} color="#22c55e" /> : <ArrowDownRight size={14} color="#ef4444" />}
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: delta > 0 ? '#22c55e' : '#ef4444' }}>
                    {delta > 0 ? '+' : ''}{delta}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
