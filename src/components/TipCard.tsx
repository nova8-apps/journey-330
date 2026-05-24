import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Droplets, Dumbbell, Heart, Scissors, Apple } from 'lucide-react-native';
import { colors } from '@/lib/theme';
import type { ImprovementTip } from '@/lib/types';

const CATEGORY_CONFIG: Record<string, { icon: React.ComponentType<{ size: number; color: string }>; color: string; bg: string; label: string }> = {
  skincare: { icon: Droplets, color: '#f472b6', bg: 'rgba(244,114,182,0.12)', label: 'Skincare' },
  exercise: { icon: Dumbbell, color: '#f97316', bg: 'rgba(249,115,22,0.12)', label: 'Exercise' },
  lifestyle: { icon: Heart, color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', label: 'Lifestyle' },
  grooming: { icon: Scissors, color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', label: 'Grooming' },
  nutrition: { icon: Apple, color: '#4ade80', bg: 'rgba(74,222,128,0.12)', label: 'Nutrition' },
};

const DIFFICULTY_CONFIG: Record<string, { color: string; label: string }> = {
  easy: { color: '#22c55e', label: 'Easy' },
  medium: { color: '#eab308', label: 'Medium' },
  hard: { color: '#ef4444', label: 'Hard' },
};

interface TipCardProps {
  tip: ImprovementTip;
  onPress?: () => void;
}

export function TipCard({ tip, onPress }: TipCardProps) {
  const cat = CATEGORY_CONFIG[tip.category] ?? CATEGORY_CONFIG.lifestyle;
  const diff = DIFFICULTY_CONFIG[tip.difficulty] ?? DIFFICULTY_CONFIG.medium;
  const IconComp = cat.icon;

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`${tip.title} tip`}
      testID={`tip-card-${tip.id}`}
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
        <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: cat.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
          <IconComp size={18} color={cat.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#f1f1f4' }}>{tip.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <View style={{ backgroundColor: cat.bg, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 10, color: cat.color }}>{cat.label}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: diff.color }} />
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: diff.color }}>{diff.label}</Text>
            </View>
          </View>
        </View>
      </View>
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 19 }}>{tip.description}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.primary }}>⏱ {tip.timeframe}</Text>
      </View>
    </Pressable>
  );
}
