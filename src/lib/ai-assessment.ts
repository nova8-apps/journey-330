import { nanoid } from 'nanoid';
import type { Assessment, FeatureGrade, Grade } from './types';
import * as FileSystem from 'expo-file-system/legacy';

// Feature definitions
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

/**
 * Analyze a face photo with OpenAI GPT-4 Vision via Nova8 AI Gateway
 * This uses Nova8's built-in AI proxy, no API key needed
 */
export async function analyzeWithAI(imageUri: string): Promise<Assessment> {
  try {
    // Convert local file URI to base64
    let base64Image: string;

    if (imageUri.startsWith('data:')) {
      // Already a data URL
      base64Image = imageUri;
    } else {
      // Read from file system and encode
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      base64Image = `data:image/jpeg;base64,${base64}`;
    }

    // Import the Nova8 backend module dynamically to avoid bundler errors
    const { openai } = await import('@/nova8/backend');

    // Call OpenAI Vision via Nova8 gateway
    const response = await openai.chat({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert facial aesthetics analyzer for a looksmaxxing app. Analyze the face photo objectively and provide scores (40-95 range) and brief descriptions for these features:
- Jawline (definition, angle, prominence)
- Eye Area (symmetry, spacing, under-eye puffiness, dark circles)
- Skin Texture (smoothness, pores, wrinkles)
- Facial Symmetry (left-right balance)
- Hair Quality (volume, styling, health)
- Lip Ratio (fullness, proportion)
- Skin Clarity (blemishes, redness, acne)
- Brow Ridge (shape, fullness, placement)

Return ONLY valid JSON with this exact schema (no markdown, no preamble):
{
  "features": [
    { "id": "jawline", "score": 72, "description": "Moderate definition with slight asymmetry" },
    { "id": "eye-area", "score": 81, "description": "Well-proportioned with minimal under-eye concerns" },
    ...
  ]
}`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this face photo and provide scores + descriptions for all 8 features. Be honest but constructive.',
            },
            {
              type: 'image_url',
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from AI');
    }

    // Parse AI response
    const parsed = JSON.parse(content.trim());
    const aiFeatures = parsed.features as Array<{ id: string; score: number; description: string }>;

    // Merge AI scores with our tips templates
    const features: FeatureGrade[] = FEATURE_TEMPLATES.map((template) => {
      const aiFeature = aiFeatures.find((f) => f.id === template.id);
      const score = aiFeature?.score ?? 70;
      const grade = scoreToGrade(score);

      return {
        id: template.id,
        name: template.name,
        grade,
        score,
        description: aiFeature?.description ?? `Analyzed ${template.name.toLowerCase()}`,
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
  } catch (error) {
    console.error('AI analysis error:', error);
    // Fall back to mock data if AI fails
    throw error;
  }
}
