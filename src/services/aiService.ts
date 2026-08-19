import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY environment variable is not set.");
    }
    aiInstance = new GoogleGenAI({ apiKey: key || "" });
  }
  return aiInstance;
}

export interface BrandDirection {
  title: string;
  concept: string;
  primaryArchetype: string;
  secondaryArchetype: string;
  archetypePositioning: {
    primary: {
      name: string;
      descriptor: string;
      justification: string;
    };
    secondary: {
      name: string;
      descriptor: string;
      justification: string;
    };
  };
  visualTerritory: {
    description: string;
    keyTraits: string[];
  };
  colorPalette: {
    hex: string;
    name: string;
    rationale: string;
  }[];
  typographyStrategy: {
    primaryFamily: string;
    secondaryFamily: string;
    justification: string;
  };
  semanticKeywords: string[];
  artisticJustification: string;
  moodboardAnalysis: {
    visualReading: string;
    keyTraits: string[];
    contribution: string;
  }[];
}

const SYSTEM_INSTRUCTION = `You are ARKHETYPIA, an elite Multimodal Virtual Art Director and Strategic Brand Architect.
Your purpose is to synthesize visual references and textual briefings into a cohesive, high-level brand direction that rivals the depth of top-tier global design agencies.

CRITICAL DIRECTIVES:
1. YOU ARE NOT A CONTENT GENERATOR. Do not provide prompts for logos or describe assets you generated.
2. YOU ARE A STRATEGIC ANALYST. You interpret the "soul", subtext, and latent meanings of the inputs using design theory, cultural semiotics, and psychological resonance.
3. BE VISIONARY & SOPHISTICATED. Use terminology from the worlds of fine art, high fashion, architectural theory, and industrial design.
4. JUTIFICATIONS MUST BE DEEP. Avoid vague adjectives. Instead, explain the "why" behind every choice—how a specific font weight balances a color's vibrance, or how a color's hex code relates to historical or natural precedents.
5. EVOLVED ARCHETYPE REASONING: Identify ONE primary archetype and ONE secondary archetype from the 12 Jungian brand archetypes framework (Mark & Pearson): Innocent, Sage, Explorer, Outlaw, Magician, Hero, Lover, Jester, Everyman, Caregiver, Ruler, Creator. Both archetypes must represent where the brand SHOULD go based on briefing + visual references, not where it currently is. The secondary archetype must complement (not duplicate) the primary, adding nuance to the brand personality.
6. ARCHETYPE POSITIONING DETAIL: Define precise archetypePositioning properties for both the primary and secondary brand archetypes, supplying a creative Jungian name, an evocative editorial descriptor, and deep strategic justification.

TYPOGRAPHY SELECTION — REASONING PROTOCOL

You are acting as a virtual art director making typographic decisions. 
Typography is never a default and never a safe pick from a popular list. 
Every font pairing must emerge from the specific project at hand.

Source of fonts:
- Only propose fonts available on Google Fonts (open source, no licensing 
  issues for the user).
- Use the exact Google Fonts name so the font can be loaded directly by the 
  frontend.

Reasoning required before selecting:
Before producing the typography fields, you must internally consider these 
four dimensions for THIS specific project:

  1. ARCHETYPE FIT — Does the font's personality match the primary and 
     secondary archetypes? A Caregiver brand and an Outlaw brand should 
     almost never receive the same typographic system.

  2. TONE FIT — Does the letterform's emotional register match the tone 
     declared in the briefing (e.g. warm, sharp, editorial, playful, 
     austere)?

  3. AUDIENCE FIT — Is the font legible, culturally appropriate and 
     resonant for the declared audience? A type system for "young coffee 
     lovers" reads very differently from one for "institutional clients".

  4. VISUAL REFERENCE FIT — Does the font dialogue with the visual 
     references uploaded by the user (composition, density, mood, era, 
     cultural cues)?

Decision criteria:
- A popular font (such as Montserrat, Playfair Display, Lora, Roboto, 
  Poppins, Raleway, Open Sans, Oswald, Nunito, etc.) is allowed ONLY if 
  it is genuinely the best fit for the four dimensions above. If you 
  choose one of these, the justification must explain specifically why 
  this brand needs that exact font and not a less common alternative.
- A less common font is preferred when the project's specificity calls 
  for it. Avoid defaulting to safe picks out of inertia.
- The display font and the body font must complement each other 
  structurally and tonally. They should not just look nice together — they 
  should function as a system (e.g. contrast, hierarchy, rhythm).
- Never pair two fonts that essentially do the same job. The display font 
  carries personality; the body font carries clarity.

Mandatory justification:
In the typography justification field of the JSON output, you must 
explicitly cite:
  · At least one element from the briefing (values, tone, audience or 
    strategic vision) that supports the choice.
  · At least one specific visual reference uploaded by the user, named or 
    described, that supports the choice.
  · A one-sentence explanation of why the display and body fonts work as a 
    pair for THIS brand.

If you cannot articulate these three things for the proposed fonts, the 
choice is wrong and you must reconsider before outputting.

Analysis Framework:
- SEMIOTIC DECODER: Analyze image compositions, lighting, textures, metaphors, and the "void" (negative space).
- LINGUISTIC BRIDGE: Map briefing keywords to visual equivalents with tactical precision.
- BRAND ALIGNMENT: Every decision must be an answer to a strategic problem posed in the briefing.

Analyze each input image individually and return one entry in moodboardAnalysis per image, in the exact same order the images were received.`;

export async function analyzeBrandIdentity(
  briefing: string,
  images: { data: string; mimeType: string }[]
): Promise<BrandDirection | null> {
  try {
    const promptParts = [
      ...images.map(img => ({
        inlineData: {
          data: img.data.split(',')[1], // Remove potential "data:image/png;base64," prefix
          mimeType: img.mimeType
        }
      })),
      { text: `USER BRIEFING: ${briefing}\n\nTASK: Synthesize this data into a master brand identity blueprint. Ensure absolute depth in artistic reasoning.` }
    ];

    const response = await getAI().models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: promptParts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A bold, evocative name for this specific visual direction." },
            concept: { type: Type.STRING, description: "The overarching strategic 'big idea' (1 sentence)." },
            primaryArchetype: { type: Type.STRING, description: "The primary brand archetype from the 12 Mark & Pearson Jungan framework: Innocent, Sage, Explorer, Outlaw, Magician, Hero, Lover, Jester, Everyman, Caregiver, Ruler, Creator." },
            secondaryArchetype: { type: Type.STRING, description: "The secondary brand archetype that complements the primary, from the same 12 Jungan framework. Must NOT duplicate the primary, adding nuance to the brand personality." },
            archetypePositioning: {
              type: Type.OBJECT,
              properties: {
                primary: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "The primary brand archetype name." },
                    descriptor: { type: Type.STRING, description: "An evocative, design-focused description or title for the primary archetype's manifestation in this project." },
                    justification: { type: Type.STRING, description: "Detailed strategic reasoning explaining how this primary archetype guides the identity." }
                  },
                  required: ["name", "descriptor", "justification"]
                },
                secondary: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "The secondary brand archetype name." },
                    descriptor: { type: Type.STRING, description: "An evocative, design-focused description or title for the secondary archetype's manifestation in this project." },
                    justification: { type: Type.STRING, description: "Detailed strategic reasoning detailing how the secondary archetype complements the primary." }
                  },
                  required: ["name", "descriptor", "justification"]
                }
              },
              required: ["primary", "secondary"]
            },
            visualTerritory: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING, description: "A 2-3 sentence evocative description of the visual world." },
                keyTraits: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 high-level aesthetic descriptors." }
              }
            },
            colorPalette: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hex: { type: Type.STRING },
                  name: { type: Type.STRING, description: "An evocative, non-generic name for the color." },
                  rationale: { type: Type.STRING, description: "Deep explanation of the color's role, psychological impact, and its relation to the other colors in the palette." }
                }
              }
            },
            typographyStrategy: {
              type: Type.OBJECT,
              properties: {
                primaryFamily: { type: Type.STRING, description: "The headline typeface name and its stylistic spirit." },
                secondaryFamily: { type: Type.STRING, description: "The body/support typeface name and its role." },
                justification: { type: Type.STRING, description: "A sophisticated analysis of why these faces pair well, their historical context, and how their geometry reinforces the brand's message." }
              }
            },
            semanticKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            artisticJustification: { type: Type.STRING, description: "A final, powerful argument for why this synthesis is the definitive answer to the user's brief. Combine semiotics, strategy, and aesthetic theory." },
            moodboardAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  visualReading: { type: Type.STRING, description: "Analysis of the image's formal qualities: composition, lighting, and texture." },
                  keyTraits: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific aesthetic descriptors found in this image." },
                  contribution: { type: Type.STRING, description: "How this specific reference influenced the final architecture of the brand." }
                },
                required: ["visualReading", "keyTraits", "contribution"]
              }
            }
          },
          required: ["title", "concept", "primaryArchetype", "secondaryArchetype", "archetypePositioning", "visualTerritory", "colorPalette", "typographyStrategy", "semanticKeywords", "artisticJustification", "moodboardAnalysis"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as BrandDirection;
  } catch (error) {
    console.error("Archetypia Analysis Error:", error);
    return null;
  }
}

export async function generateRefinementQuestions(
  briefing: string
): Promise<string[] | null> {
  try {
    const systemInstruction = `You are a friendly, encouraging senior design mentor helping a beginner or junior designer refine their brand briefing.
Your goal is to parse the user's input, detect generic, vague, or undefined terms (like "modern", "premium", or "authentic"), and ask exactly three extremely easy refinement questions.

CRITICAL DIRECTIVES:
1. Absolutely NO design or branding strategy jargon. Use everyday, simple language.
2. Each question must be short (MAXIMUM 12 WORDS).
3. Do not ask for abstract concepts. Instead, offer a direct choice between clear, simple options (e.g., "Is your brand super colorful or mostly black and white?") or ask for a simple visual example/vibe.
4. Keep the tone warm, close, direct, and supportive—like a friendly mentor helping a beginner.
5. Every question must be in the EXACT same language as the user's provided briefing (e.g., if Irish/Spanish/English is used, reply in the very same language).`;

    const response = await getAI().models.generateContent({
      model: "gemini-3.5-flash",
      contents: `USER BRIEFING:\n${briefing}\n\nTask: Parse the briefing and generate exactly three friendly, non-technical refinement questions in the same language. Make sure each question is under 12 words and asks for a concrete choice or simple example.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "An array of exactly three simple, short refinement questions under 12 words each."
        }
      }
    });

    const parsed = JSON.parse(response.text || "[]");
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, 3);
    }
    return null;
  } catch (error) {
    console.error("Error generating refinement questions:", error);
    return null;
  }
}
