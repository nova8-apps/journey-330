import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { getGradeColor } from '@/lib/theme';
import type { Grade } from '@/lib/types';

interface GradeRingProps {
  grade: Grade;
  score: number;
  size?: number;
  strokeWidth?: number;
  showScore?: boolean;
}

export function GradeRing({ grade, score, size = 80, strokeWidth = 6, showScore = false }: GradeRingProps) {
  const color = getGradeColor(grade);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: 'Inter_800ExtraBold',
            fontSize: size * 0.3,
            color,
            letterSpacing: -0.5,
          }}
        >
          {grade}
        </Text>
        {showScore && (
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: size * 0.14,
              color: 'rgba(255,255,255,0.5)',
              marginTop: -2,
            }}
          >
            {score}/100
          </Text>
        )}
      </View>
    </View>
  );
}
