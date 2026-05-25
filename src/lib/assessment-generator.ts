import { nanoid } from 'nanoid';
import type { Assessment, FeatureGrade, Grade } from './types';

// 12 PSL feature templates for fallback generation
const FEATURE_TEMPLATES = [
  {
    id: 'canthal-tilt',
    name: 'Canthal Tilt',
    icon: 'eye',
    category: 'miscellaneous' as const,
    idealRange: '+3° to +7°',
    tips: [
      'Positive canthal tilt is primarily genetic — limited natural interventions',
      'Ensure good under-eye care (sleep, hydration) to prevent drooping appearance',
      'Maintain low body fat to avoid orbital fat pad sagging',
      'Consider blepharoplasty consultation if severe negative tilt (surgical only)',
    ],
  },
  {
    id: 'hunter-eyes',
    name: 'Hunter Eyes Composite',
    icon: 'eye',
    category: 'dimorphism' as const,
    idealRange: 'Deep-set, hooded, strong limbal ring',
    tips: [
      'Get 7-9 hours of sleep to maximize limbal ring contrast',
      'Use cold compresses to reduce orbital puffiness',
      'Maintain low body fat — orbital fat pads diminish eye depth',
      'Stay hydrated — dehydration reduces limbal ring visibility',
      'Wear blue-light glasses to prevent eye strain and redness',
    ],
  },
  {
    id: 'symmetry',
    name: 'Facial Symmetry',
    icon: 'symmetry',
    category: 'harmony' as const,
    idealRange: '95–99% bilateral match',
    tips: [
      'Sleep on your back to prevent facial compression asymmetry',
      'Chew evenly on both sides to balance masseter development',
      'Correct forward head posture — asymmetry often postural',
      'Consider facial massage to relax overactive unilateral muscles',
    ],
  },
  {
    id: 'facial-thirds',
    name: 'Facial Thirds & Harmony',
    icon: 'ruler',
    category: 'harmony' as const,
    idealRange: '33/33/33 (hairline-to-brow / brow-to-nose base / nose base-to-chin)',
    tips: [
      'Optimize hairstyle to balance upper third (fringe can shorten forehead visually)',
      'Facial harmony is primarily structural — limited non-surgical options',
      'Maintain lean body fat to reveal true facial proportions',
      'Consider beard styling to adjust lower-third perception',
    ],
  },
  {
    id: 'fwhr',
    name: 'FWHR',
    icon: 'scan',
    category: 'harmony' as const,
    idealRange: '1.85–2.0 (men) / 1.6–1.75 (women)',
    tips: [
      'Chew mastic gum to widen masseter muscles (increases bizygomatic width)',
      'Lose body fat to reveal true bone structure',
      'Facial width is primarily genetic — limited natural changes',
      'Hairstyle can visually adjust perceived width (side volume vs. top height)',
    ],
  },
  {
    id: 'jawline-gonial',
    name: 'Jawline & Gonial Angle',
    icon: 'jawline',
    category: 'dimorphism' as const,
    idealRange: '110–120° (men) / 120–128° (women)',
    tips: [
      'Practice mewing — tongue posture on the palate 24/7 for forward growth',
      'Chew mastic gum 30 min/day for masseter hypertrophy',
      'Reduce sodium to minimize water retention masking definition',
      'Lose body fat to 12-15% for visible jaw definition',
      'Consider jawline exercises (chin tucks, neck curls) with caution',
    ],
  },
  {
    id: 'chin-projection',
    name: 'Chin Projection',
    icon: 'jawline',
    category: 'dimorphism' as const,
    idealRange: 'Chin equal to or slightly behind lower lip in Frankfurt horizontal',
    tips: [
      'Chin projection is primarily skeletal — limited non-surgical options',
      'Maintain proper tongue posture (mewing) to support forward growth in youth',
      'Lose facial fat to reveal true chin projection',
      'Beard styling can visually adjust weak chin (goatee extends perceived projection)',
    ],
  },
  {
    id: 'cheekbone-ogee',
    name: 'Cheekbone Projection & Ogee Curve',
    icon: 'scan',
    category: 'angularity' as const,
    idealRange: 'Cheekbones projecting forward of mid-face with visible S-curve',
    tips: [
      'Lose body fat to 10-12% to reveal underlying cheekbone structure',
      'Chewing exercises may slightly enhance zygomatic arch prominence',
      'Avoid excessive sodium — water retention masks cheekbone definition',
      'Cheekbone height/projection is primarily genetic',
    ],
  },
  {
    id: 'eye-bags',
    name: 'Eye Bags & Under-Eye',
    icon: 'eye',
    category: 'miscellaneous' as const,
    idealRange: 'Smooth flat infraorbital, no festoons or dark hollowing',
    tips: [
      'Get 7-9 hours of quality sleep consistently',
      'Apply caffeine eye cream morning and night',
      'Use cold compress for 5 min to reduce puffiness',
      'Stay hydrated — 3L water minimum daily',
      'Reduce sodium intake to prevent fluid retention',
      'Consider vitamin K cream for dark circles',
    ],
  },
  {
    id: 'skin-texture',
    name: 'Skin Quality & Texture',
    icon: 'skin',
    category: 'miscellaneous' as const,
    idealRange: 'Smooth even texture, zero active inflammation',
    tips: [
      'Use retinol 0.5% every other night (build tolerance slowly)',
      'Apply SPF 50 every morning — non-negotiable',
      'Double cleanse PM: oil cleanser → gentle foaming cleanser',
      'Niacinamide 10% serum for pore refinement',
      'Chemical exfoliant (AHA/BHA) 2x per week maximum',
      'Stay hydrated and get adequate sleep for skin repair',
    ],
  },
  {
    id: 'skin-clarity',
    name: 'Skin Clarity',
    icon: 'clarity',
    category: 'miscellaneous' as const,
    idealRange: 'Even tone, no hyperpigmentation or post-acne marks',
    tips: [
      'Use benzoyl peroxide 2.5% as spot treatment for active acne',
      'Salicylic acid cleanser for T-zone control and pore clearing',
      'Change pillowcase every 2-3 days to prevent bacteria transfer',
      'Cut dairy and refined sugar for 30 days (reduces IGF-1)',
      "Don't touch your face — bacteria transfer causes breakouts",
      'Consider azelaic acid 15% for hyperpigmentation and redness',
    ],
  },
  {
    id: 'philtrum-lip',
    name: 'Philtrum & Lip Ratio',
    icon: 'lips',
    category: 'miscellaneous' as const,
    idealRange: 'Philtrum 13–15 mm (men) / 11–13 mm (women), lip ratio ~1:1.6',
    tips: [
      'Philtrum length is skeletal — no natural shortening methods',
      'Exfoliate lips weekly with sugar scrub for smooth texture',
      'Apply lip balm with SPF during the day to prevent darkening',
      'Stay hydrated for natural lip plumpness',
      'Use hyaluronic acid lip treatment at night',
    ],
  },
];

function generateDescription(name: string, score: number): string {
  const descriptors = {
    high: [
      `Strong ${name.toLowerCase()} with excellent definition`,
      `Well-developed ${name.toLowerCase()} showing good structure`,
      `Above-average ${name.toLowerCase()} with minimal issues`,
      `Impressive ${name.toLowerCase()} within ideal PSL range`,
    ],
    medium: [
      `Moderate ${name.toLowerCase()} with room for improvement`,
      `Average ${name.toLowerCase()} showing some deviation from ideal`,
      `Decent ${name.toLowerCase()} that could be enhanced`,
      `Fair ${name.toLowerCase()} with a few minor concerns`,
    ],
    low: [
      `Below-ideal ${name.toLowerCase()} requiring attention`,
      `${name} shows significant deviation from PSL standards`,
      `Weak ${name.toLowerCase()} needing focused improvement`,
      `${name} could benefit from targeted looksmaxxing`,
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

function getPslTier(overallScore: number): string {
  if (overallScore >= 90) return 'GigaChad';
  if (overallScore >= 83) return 'Chad';
  if (overallScore >= 76) return 'Chadlite';
  if (overallScore >= 70) return 'HTN';
  if (overallScore >= 63) return 'MTN';
  if (overallScore >= 55) return 'LTN';
  return 'Sub3';
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
      idealRange: template.idealRange,
    };
  });

  const overallScore = Math.round(
    features.reduce((sum, f) => sum + f.score, 0) / features.length
  );
  const overallGrade = scoreToGrade(overallScore);
  const pslTier = getPslTier(overallScore);

  return {
    id: nanoid(),
    date: new Date().toISOString().split('T')[0],
    overallGrade,
    overallScore,
    pslTier,
    features,
  };
}
