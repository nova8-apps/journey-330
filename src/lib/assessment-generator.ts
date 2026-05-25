import { nanoid } from 'nanoid';
import type { Assessment, FeatureGrade, Grade } from './types';

// Feature templates with realistic variance
const FEATURE_TEMPLATES = [
  {
    id: 'jawline',
    name: 'Jawline',
    icon: 'jawline',
    category: 'structure' as const,
    tips: [
      'Practice mewing — tongue posture on the palate 24/7',
      'Chew mastic gum 30 min/day for masseter hypertrophy',
      'Reduce sodium to minimize water retention',
      'Lose body fat to 12-15% for visible jaw definition',
      'Consider jawline exercises (chin tucks, neck curls)',
    ],
  },
  {
    id: 'eye-area',
    name: 'Eye Area',
    icon: 'eye',
    category: 'features' as const,
    tips: [
      'Get 7-9 hours of quality sleep consistently',
      'Apply caffeine eye cream morning and night',
      'Use cold compress for 5 min to reduce puffiness',
      'Stay hydrated — 3L water minimum daily',
      'Wear blue-light glasses if you screen-time heavily',
    ],
  },
  {
    id: 'skin-texture',
    name: 'Skin Texture',
    icon: 'skin',
    category: 'skin' as const,
    tips: [
      'Use retinol 0.5% every other night (build tolerance)',
      'Apply SPF 50 every morning — non-negotiable',
      'Double cleanse PM: oil cleanser → gentle foaming',
      'Niacinamide 10% serum for pore refinement',
      'Chemical exfoliant (AHA/BHA) 2x per week',
    ],
  },
  {
    id: 'symmetry',
    name: 'Facial Symmetry',
    icon: 'symmetry',
    category: 'structure' as const,
    tips: [
      'Sleep on your back to prevent facial compression',
      'Chew evenly on both sides of your mouth',
      'Correct posture — forward head posture causes asymmetry',
      'Consider facial massage to relax overactive muscles',
    ],
  },
  {
    id: 'hair',
    name: 'Hair Quality',
    icon: 'hair',
    category: 'features' as const,
    tips: [
      'Use ketoconazole shampoo 2x/week as prevention',
      'Take biotin + zinc daily for hair strength',
      'Minimize heat styling — air dry when possible',
      'Get a fresh cut every 3-4 weeks for clean look',
    ],
  },
  {
    id: 'lips',
    name: 'Lip Ratio',
    icon: 'lips',
    category: 'features' as const,
    tips: [
      'Exfoliate lips weekly with sugar scrub',
      'Apply lip balm with SPF during the day',
      'Stay hydrated for natural plumpness',
      'Use hyaluronic acid lip treatment at night',
    ],
  },
  {
    id: 'skin-clarity',
    name: 'Skin Clarity',
    icon: 'clarity',
    category: 'skin' as const,
    tips: [
      'Use benzoyl peroxide 2.5% as spot treatment',
      'Salicylic acid cleanser for T-zone control',
      'Change pillowcase every 2-3 days',
      'Cut dairy and refined sugar for 30 days',
      "Don't touch your face — bacteria transfer causes breakouts",
      'Consider azelaic acid 15% for hyperpigmentation',
    ],
  },
  {
    id: 'brow-ridge',
    name: 'Brow Ridge',
    icon: 'brow',
    category: 'features' as const,
    tips: [
      'Get brows professionally shaped — clean up strays',
      'Use castor oil nightly for thicker brow growth',
      "Don't over-pluck — masculine brows are fuller",
      'Consider brow lamination for a structured look',
    ],
  },
];

function generateDescription(name: string, score: number): string {
  const descriptors = {
    high: [
      `Strong ${name.toLowerCase()} with excellent definition`,
      `Well-developed ${name.toLowerCase()} showing good structure`,
      `Above-average ${name.toLowerCase()} with minimal issues`,
      `Impressive ${name.toLowerCase()} with strong characteristics`,
    ],
    medium: [
      `Moderate ${name.toLowerCase()} with room for improvement`,
      `Average ${name.toLowerCase()} showing some asymmetries`,
      `Decent ${name.toLowerCase()} that could be enhanced`,
      `Fair ${name.toLowerCase()} with a few minor concerns`,
    ],
    low: [
      `Underdeveloped ${name.toLowerCase()} requiring attention`,
      `${name} shows signs of neglect or poor habits`,
      `Weak ${name.toLowerCase()} needing significant work`,
      `${name} could benefit from focused improvement`,
    ],
  };

  const tier = score >= 75 ? 'high' : score >= 55 ? 'medium' : 'low';
  const options = descriptors[tier];
  return options[Math.floor(Math.random() * options.length)];
}

function scoreToGrade(score: number): Grade {
  if (score >= 93) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 87) return 'A-';
  if (score >= 83) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 77) return 'B-';
  if (score >= 73) return 'C+';
  if (score >= 70) return 'C';
  if (score >= 67) return 'C-';
  if (score >= 63) return 'D+';
  if (score >= 60) return 'D';
  if (score >= 57) return 'D-';
  return 'F';
}

export function generateAssessment(): Assessment {
  const features: FeatureGrade[] = FEATURE_TEMPLATES.map((template) => {
    // Generate realistic score variance (40-95 range, bell curve around 70)
    const baseScore = 70 + (Math.random() - 0.5) * 40;
    const score = Math.max(40, Math.min(95, Math.round(baseScore)));
    const grade = scoreToGrade(score);

    return {
      id: template.id,
      name: template.name,
      grade,
      score,
      description: generateDescription(template.name, score),
      icon: template.icon,
      tips: template.tips,
      category: template.category,
    };
  });

  const overallScore = Math.round(
    features.reduce((sum, f) => sum + f.score, 0) / features.length
  );
  const overallGrade = scoreToGrade(overallScore);

  return {
    id: nanoid(),
    date: new Date().toISOString().split('T')[0],
    overallGrade,
    overallScore,
    features,
  };
}
