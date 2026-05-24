import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight, Shield, Eye, Sparkles, Scan, Scissors, Smile, Sun, Ruler } from 'lucide-react-native';
import { getGradeColor, getGradeBg } from '@/lib/theme';
import type { FeatureGrade } from '@/lib/types';

const ICON_MAP: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  jawline: Shield,
  eye: Eye,
  skin: Sparkles,
  symmetry: Scan,
  hair: Scissors,
  lips: Smile,
  clarity: Sun,
  brow: Ruler,
};

interface FeatureCardProps {
  feature: FeatureGrade;
  onPress: () => void;
  compact?: boolean;
}

export function FeatureCard({ feature, onPress, compact = false }: FeatureCardProps) {
  const color = getGradeColor(feature.grade);
  const bgColor = getGradeBg(feature.grade);
  const IconComponent = ICON_MAP[feature.icon] ?? Sparkles;

  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityLabel={`View ${feature.name} details, grade ${feature.grade}`}
        testID={`feature-card-${feature.id}`}
        style={{
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius: 16,
          padding: 14,
          width: 140,
          marginRight: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center' }}>
            <IconComponent size={16} color={color} />
          </View>
        </View>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#f1f1f4', marginBottom: 4 }}>{feature.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
          <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 24, color, letterSpacing: -0.5 }}>{feature.grade}</Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{feature.score}/100</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`View ${feature.name} details, grade ${feature.grade}`}
      testID={`feature-card-${feature.id}`}
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      }}
    >
      <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
        <IconComponent size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#f1f1f4' }}>{feature.name}</Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }} numberOfLines={1}>
          {feature.description}
        </Text>
      </View>
      <View style={{ alignItems: 'center', marginRight: 8 }}>
        <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 22, color, letterSpacing: -0.5 }}>{feature.grade}</Text>
      </View>
      <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
    </Pressable>
  );
}
