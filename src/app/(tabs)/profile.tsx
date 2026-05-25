import React from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ChevronRight, Bell, Ruler, Moon, Shield, HelpCircle, Star, LogOut } from 'lucide-react-native';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import type { Assessment } from '@/lib/types';

function calculateStreak(assessments: Assessment[]): number {
  if (assessments.length === 0) return 0;
  const sorted = [...assessments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date);
    const curr = new Date(sorted[i].date);
    const dayDiff = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
    if (dayDiff <= 7) streak++;
    else break;
  }
  return streak;
}

interface SettingRowProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  iconColor?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
}

function SettingRow({ icon: Icon, iconColor, label, value, onPress, destructive }: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      testID={`setting-${label.toLowerCase().replace(/\s/g, '-')}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
      }}
    >
      <View style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        <Icon size={16} color={iconColor ?? (destructive ? '#ef4444' : 'rgba(255,255,255,0.5)')} />
      </View>
      <Text style={{ flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: destructive ? '#ef4444' : '#f1f1f4' }}>{label}</Text>
      {value ? <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginRight: 6 }}>{value}</Text> : null}
      <ChevronRight size={16} color="rgba(255,255,255,0.15)" />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const notificationsEnabled = useAppStore((s) => s.notificationsEnabled);
  const toggleNotifications = useAppStore((s) => s.toggleNotifications);
  const units = useAppStore((s) => s.units);
  const assessments = useAppStore((s) => s.assessments);
  const currentAssessment = useAppStore((s) => s.currentAssessment);

  const displayName = 'Journey';
  const scanCount = assessments.length;
  const joinDate = assessments.length > 0
    ? new Date(assessments[0].date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const streakDays = calculateStreak(assessments);
  const bestFeature = currentAssessment
    ? [...currentAssessment.features].sort((a, b) => b.score - a.score)[0]
    : null;
  const focusArea = currentAssessment
    ? [...currentAssessment.features].sort((a, b) => a.score - b.score)[0]
    : null;

  const handleToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleNotifications();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#0a0a0f' }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header — avatar row */}
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20, alignItems: 'center', marginBottom: 24 }}>
        <View style={{
          width: 72, height: 72, borderRadius: 36,
          backgroundColor: colors.primary,
          alignItems: 'center', justifyContent: 'center',
          marginBottom: 12,
        }}>
          <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 28, color: '#fff' }}>
            {displayName.charAt(0)}
          </Text>
        </View>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 22, color: '#f1f1f4', marginBottom: 4 }}>{displayName}</Text>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Star size={12} color={colors.primary} />
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
              {scanCount > 0 ? `${scanCount} scans` : '—'}
            </Text>
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.15)' }}>·</Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
            Joined {joinDate}
          </Text>
        </View>
      </View>

      {/* Quick stats */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 28 }}>
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 14, alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 24, color: colors.primary, letterSpacing: -0.5 }}>
            {streakDays > 0 ? streakDays : '—'}
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Day Streak</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 14, alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 24, color: '#22c55e', letterSpacing: -0.5 }}>
            {bestFeature ? bestFeature.grade : '—'}
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
            Best: {bestFeature ? bestFeature.name : '—'}
          </Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 14, alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 24, color: '#eab308', letterSpacing: -0.5 }}>
            {focusArea ? focusArea.grade : '—'}
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
            Focus: {focusArea ? focusArea.name : '—'}
          </Text>
        </View>
      </View>

      {/* Settings sections */}
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8, marginLeft: 4 }}>PREFERENCES</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
          <SettingRow icon={Bell} iconColor={colors.primary} label="Reminders" value={notificationsEnabled ? 'On' : 'Off'} onPress={handleToggle} />
          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.04)', marginLeft: 62 }} />
          <SettingRow icon={Ruler} label="Units" value={units === 'metric' ? 'Metric' : 'Imperial'} />
          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.04)', marginLeft: 62 }} />
          <SettingRow icon={Moon} label="Appearance" value="Dark" />
        </View>

        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8, marginLeft: 4 }}>ABOUT</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
          <SettingRow icon={Shield} label="Privacy Policy" />
          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.04)', marginLeft: 62 }} />
          <SettingRow icon={HelpCircle} label="Help & Support" />
          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.04)', marginLeft: 62 }} />
          <SettingRow icon={Star} label="Rate App" />
        </View>

        <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, overflow: 'hidden' }}>
          <SettingRow icon={LogOut} label="Sign Out" destructive />
        </View>

        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 24 }}>
          That Grades Your · Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}
