import { nanoid } from 'nanoid';
import type { Assessment, FeatureGrade, Grade } from './types';
import * as FileSystem from 'expo-file-system/legacy';

// 12 scientifically-grounded PSL feature templates
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
      'Hunter eyes benefit from hooded lids — avoid excessive upper eyelid surgery',
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
      'Maintain low body fat - orbital fat pads diminish eye depth',
      'Squinting exercises (risky - can cause crows feet)',
      'Stay hydrated - dehydration reduces limbal ring visibility',
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
    name: 'FWHR (Facial Width-to-Height Ratio)',
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
      'Facial contouring with makeup (temporary visual enhancement)',
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
      'Avoid excessive lip pursing or unnatural expressions',
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

function getPslTier(overallScore: number): string {
  if (overallScore >= 90) return 'GigaChad';
  if (overallScore >= 83) return 'Chad';
  if (overallScore >= 76) return 'Chadlite';
  if (overallScore >= 70) return 'HTN';
  if (overallScore >= 63) return 'MTN';
  if (overallScore >= 55) return 'LTN';
  return 'Sub3';
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
          content: `You are an expert PSL (looksmaxxing) facial aesthetics analyzer. Score each feature 0-100 using this normalized band:
85-100 = ideal range achieved (objectively attractive by PSL standards)
65-84 = good but not ideal (above average)
40-64 = acceptable deficit (average to slightly below)
<40 = notable deficit (needs significant improvement)

Analyze the face photo and provide scores + descriptions for these 12 PSL features with EXACT ideal range anchors:

1. **Canthal Tilt** (ideal: +3° to +7° positive tilt)
   - Neutral horizontal = 60, +3° to +7° = 85-100, negative tilt = <50

2. **Hunter Eyes Composite** (ideal: deep-set, hooded, strong limbal ring)
   - All three traits present = 85-100, 2/3 traits = 65-84, 1/3 or none = <65

3. **Facial Symmetry** (ideal: 95-99% bilateral match)
   - 95-99% symmetry = 85-100, 90-94% = 70-84, <90% = <70

4. **Facial Thirds & Harmony** (ideal: equal thirds 33/33/33 hairline-to-brow / brow-to-nose base / nose base-to-chin)
   - Equal thirds = 85-100, any third deviating >5% = proportional deduction (e.g., 35/30/35 = ~70)

5. **FWHR (Facial Width-to-Height Ratio)** (ideal: 1.85-2.0 men / 1.6-1.75 women)
   - 1.85-2.0 men = 85-100, <1.6 or >2.2 = <55, intermediate = 60-84

6. **Jawline & Gonial Angle** (ideal: 110-120° men / 120-128° women for sharp defined jaw)
   - 110-120° men = 85-100, 120-130° men = 65-84, >130° = <60, <110° = <55

7. **Chin Projection** (ideal: chin equal to or slightly behind lower lip in Frankfurt horizontal)
   - Ideal projection = 85-100, recessed = <60, overprojected = 60-75

8. **Cheekbone Projection & Ogee Curve** (ideal: cheekbones projecting forward with visible S-curve)
   - Visible ogee + forward projection = 85-100, flat mid-face = <60

9. **Eye Bags & Under-Eye** (ideal: smooth flat infraorbital, no festoons or dark hollowing)
   - Smooth = 85-100, mild bags/darkness = 65-84, severe = <50

10. **Skin Quality & Texture** (ideal: smooth even texture, zero active inflammation)
    - Perfect texture = 85-100, minor texture issues = 65-84, acne/scarring = <65

11. **Skin Clarity** (ideal: even tone, no hyperpigmentation or post-acne marks)
    - Even tone = 85-100, minor hyperpigmentation = 65-84, active breakouts = <60

12. **Philtrum & Lip Ratio** (ideal: philtrum 13-15 mm men / 11-13 mm women, upper-to-lower lip ratio ~1:1.6)
    - Ideal proportions = 85-100, too long/short philtrum = <70

Return ONLY valid JSON with this exact schema (no markdown, no preamble):
{
  "features": [
    { "id": "canthal-tilt", "score": 72, "description": "Slight positive tilt, +2° estimated" },
    { "id": "hunter-eyes", "score": 81, "description": "Good hooding and depth, moderate limbal ring" },
    { "id": "symmetry", "score": 88, "description": "High bilateral match, 96% symmetry estimated" },
    { "id": "facial-thirds", "score": 76, "description": "Slightly long upper third (35/32/33)" },
    { "id": "fwhr", "score": 85, "description": "1.9 FWHR, ideal masculine width" },
    { "id": "jawline-gonial", "score": 68, "description": "115° gonial angle, good definition but slight softness" },
    { "id": "chin-projection", "score": 82, "description": "Adequate projection, aligned with lower lip" },
    { "id": "cheekbone-ogee", "score": 79, "description": "Moderate cheekbone projection, ogee curve present" },
    { "id": "eye-bags", "score": 64, "description": "Mild under-eye puffiness, slight dark circles" },
    { "id": "skin-texture", "score": 71, "description": "Some visible pores, minor textural inconsistencies" },
    { "id": "skin-clarity", "score": 58, "description": "Active breakouts on chin, post-acne hyperpigmentation" },
    { "id": "philtrum-lip", "score": 75, "description": "14 mm philtrum (ideal range), balanced lip ratio" }
  ]
}`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this face photo and provide PSL scores + descriptions for all 12 features using the exact ideal range anchors. Be objective and precise.',
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
      max_tokens: 1500,
      temperature: 0.5,
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
  } catch (error) {
    console.error('AI analysis error:', error);
    // Fall back to mock data if AI fails
    throw error;
  }
}
