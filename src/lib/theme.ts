// Theme constants for the looksmaxing app
export const colors = {
  // Accent
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryDark: '#2563eb',

  // Surfaces
  bg: '#0a0a0f',
  surface: '#111118',
  surfaceElevated: '#1a1a24',
  surfaceInput: '#22222e',

  // Text
  textPrimary: '#f1f1f4',
  textSecondary: '#8b8b9e',
  textMuted: '#55556a',

  // Borders
  border: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(255,255,255,0.12)',

  // Grades
  gradeA: '#22c55e',
  gradeB: '#84cc16',
  gradeC: '#eab308',
  gradeD: '#f97316',
  gradeF: '#ef4444',

  // Status
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

export function getGradeColor(grade: string): string {
  switch (grade.toUpperCase()) {
    case 'A+': case 'A': case 'A-': return colors.gradeA;
    case 'B+': case 'B': case 'B-': return colors.gradeB;
    case 'C+': case 'C': case 'C-': return colors.gradeC;
    case 'D+': case 'D': case 'D-': return colors.gradeD;
    default: return colors.gradeF;
  }
}

export function getGradeBg(grade: string): string {
  switch (grade.toUpperCase()) {
    case 'A+': case 'A': case 'A-': return 'rgba(34,197,94,0.12)';
    case 'B+': case 'B': case 'B-': return 'rgba(132,204,22,0.12)';
    case 'C+': case 'C': case 'C-': return 'rgba(234,179,8,0.12)';
    case 'D+': case 'D': case 'D-': return 'rgba(249,115,22,0.12)';
    default: return 'rgba(239,68,68,0.12)';
  }
}
