import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Target, CheckCircle2, Circle, Sparkles } from 'lucide-react-native';
import { TipCard } from '@/components/TipCard';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import type { ImprovementTip } from '@/lib/types';

type FilterCategory = 'all' | 'skincare' | 'exercise' | 'lifestyle' | 'grooming' | 'nutrition';

const FILTERS: { key: FilterCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'skincare', label: 'Skincare' },
  { key: 'exercise', label: 'Exercise' },
  { key: 'lifestyle', label: 'Lifestyle' },
  { key: 'grooming', label: 'Grooming' },
  { key: 'nutrition', label: 'Nutrition' },
];

export default function PlanScreen() {
  const insets = useSafeAreaInsets();
  const currentAssessment = useAppStore((s) => s.currentAssessment);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [completedTips, setCompletedTips] = useState<Set<string>>(new Set());

  const weakestFeatures = useMemo(() => {
    if (!currentAssessment) return [];
    return [...currentAssessment.features].sort((a, b) => a.score - b.score).slice(0, 3);
  }, [currentAssessment]);

  const allTips = useMemo((): ImprovementTip[] => {
    if (!currentAssessment) return [];
    return weakestFeatures.flatMap((feature, idx) =>
      feature.tips.map((tipText, tipIdx) => ({
        id: `${feature.id}-tip-${tipIdx}`,
        featureId: feature.id,
        title: tipText.split('—')[0].trim(),
        description: tipText.includes('—') ? tipText.split('—')[1].trim() : tipText,
        difficulty: (idx === 0 ? 'easy' : idx === 1 ? 'medium' : 'hard') as 'easy' | 'medium' | 'hard',
        timeframe: idx === 0 ? '1-2 weeks' : idx === 1 ? '3-6 weeks' : '2-3 months',
        category: feature.category === 'miscellaneous' ? 'skincare' : feature.category === 'dimorphism' ? 'exercise' : 'lifestyle',
      }))
    );
  }, [currentAssessment, weakestFeatures]);

  const filteredTips = useMemo(() => {
    if (activeFilter === 'all') return allTips;
    return allTips.filter((t) => t.category === activeFilter);
  }, [allTips, activeFilter]);

  const toggleTip = (tipId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCompletedTips((prev) => {
      const next = new Set(prev);
      if (next.has(tipId)) {
        next.delete(tipId);
      } else {
        next.add(tipId);
      }
      return next;
    });
  };

  const completedCount = completedTips.size;
  const totalCount = allTips.length;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Empty state when no scans
  if (!currentAssessment) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
        <Sparkles size={64} color={colors.primary} style={{ marginBottom: 20 }} />
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 24, color: '#f1f1f4', textAlign: 'center', marginBottom: 10 }}>
          No Plan Yet
        </Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
          Take a scan to get a personalized improvement plan
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
      {/* Header — progress strip style */}
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, marginBottom: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Target size={18} color={colors.primary} />
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 22, color: '#f1f1f4', letterSpacing: -0.5 }}>Improvement Plan</Text>
          </View>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: colors.primary }}>{completedCount}/{totalCount}</Text>
        </View>
        {/* Progress bar */}
        <View style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 6 }}>
          <View style={{ height: 4, backgroundColor: colors.primary, borderRadius: 2, width: `${progressPct}%` }} />
        </View>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          Complete tasks to level up your appearance
        </Text>
      </View>

      {/* Priority areas */}
      {weakestFeatures.length > 0 ? (
        <View style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 20 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>Priority Focus</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {weakestFeatures.map((f) => (
              <View key={f.id} style={{ backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(239,68,68,0.12)' }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#ef4444' }}>{f.name}</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: 'rgba(239,68,68,0.6)', marginTop: 1 }}>{f.grade} · {f.score}/100</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
        style={{ flexGrow: 0, marginBottom: 16 }}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setActiveFilter(f.key)}
            accessibilityLabel={`Filter by ${f.label}`}
            testID={`filter-${f.key}`}
            style={{
              backgroundColor: activeFilter === f.key ? colors.primary : 'rgba(255,255,255,0.06)',
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 8,
              marginRight: 8,
            }}
          >
            <Text style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 12,
              color: activeFilter === f.key ? '#fff' : 'rgba(255,255,255,0.5)',
            }}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Tips */}
      <View style={{ paddingHorizontal: 20 }}>
        {filteredTips.map((tip) => {
          const isCompleted = completedTips.has(tip.id);
          return (
            <View key={tip.id} style={{ position: 'relative' }}>
              <TipCard tip={tip} onPress={() => toggleTip(tip.id)} />
              {/* Completion toggle overlay */}
              <Pressable
                onPress={() => toggleTip(tip.id)}
                accessibilityLabel={isCompleted ? `Mark ${tip.title} incomplete` : `Mark ${tip.title} complete`}
                testID={`toggle-tip-${tip.id}`}
                hitSlop={8}
                style={{ position: 'absolute', top: 16, right: 16 }}
              >
                {isCompleted
                  ? <CheckCircle2 size={22} color="#22c55e" />
                  : <Circle size={22} color="rgba(255,255,255,0.15)" />}
              </Pressable>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
