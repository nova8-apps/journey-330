import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import type { ProgressEntry } from '@/lib/types';
import { colors } from '@/lib/theme';

interface ProgressChartProps {
  data: ProgressEntry[];
  width?: number;
  height?: number;
}

export function ProgressChart({ data, width = 320, height = 160 }: ProgressChartProps) {
  if (data.length < 2) return null;

  const paddingLeft = 0;
  const paddingRight = 0;
  const paddingTop = 20;
  const paddingBottom = 30;
  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const minScore = Math.min(...data.map((d) => d.score)) - 5;
  const maxScore = Math.max(...data.map((d) => d.score)) + 5;
  const range = maxScore - minScore || 1;

  const points = data.map((d, i) => ({
    x: paddingLeft + (i / (data.length - 1)) * chartW,
    y: paddingTop + chartH - ((d.score - minScore) / range) * chartH,
  }));

  // Smooth curve path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const cp1x = points[i].x + (points[i + 1].x - points[i].x) / 3;
    const cp1y = points[i].y;
    const cp2x = points[i + 1].x - (points[i + 1].x - points[i].x) / 3;
    const cp2y = points[i + 1].y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i + 1].x} ${points[i + 1].y}`;
  }

  // Area fill path
  const areaD = pathD + ` L ${points[points.length - 1].x} ${paddingTop + chartH} L ${points[0].x} ${paddingTop + chartH} Z`;

  const lastPoint = points[points.length - 1];

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.primary} stopOpacity="0.2" />
            <Stop offset="1" stopColor={colors.primary} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = paddingTop + chartH * (1 - pct);
          return (
            <Rect key={pct} x={paddingLeft} y={y} width={chartW} height={0.5} fill="rgba(255,255,255,0.05)" />
          );
        })}

        {/* Area fill */}
        <Path d={areaD} fill="url(#areaGrad)" />

        {/* Line */}
        <Path d={pathD} stroke={colors.primary} strokeWidth={2.5} fill="none" strokeLinecap="round" />

        {/* Last point glow */}
        <Circle cx={lastPoint.x} cy={lastPoint.y} r={8} fill={colors.primary} opacity={0.2} />
        <Circle cx={lastPoint.x} cy={lastPoint.y} r={4} fill={colors.primary} />
        <Circle cx={lastPoint.x} cy={lastPoint.y} r={2} fill="#fff" />
      </Svg>

      {/* Labels */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width, paddingHorizontal: 4, marginTop: -24 }}>
        {data.map((d, i) => (
          <Text key={i} style={{ fontFamily: 'Inter_400Regular', fontSize: 9, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
            {d.date}
          </Text>
        ))}
      </View>
    </View>
  );
}
