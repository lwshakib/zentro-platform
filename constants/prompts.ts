export const SCRIPT_GENERATE_PROMPT = `Generate two distinct, high-quality scripts on the topic of {{TOPIC}}. Each script should be specifically crafted for 40-second video content and optimized for AI text-to-speech conversion.

SCRIPT REQUIREMENTS:
- Hook viewers within the first 3-5 seconds using: surprising facts, myth-busting revelations, shocking statistics, bold questions, or counterintuitive statements
- Structure for maximum retention: strong opening hook, 2-3 key points with smooth transitions, compelling conclusion or call-to-action
- Word count: 90-110 words per script (optimal for 40-second TTS at natural speaking pace)
- Use conversational, direct language as if speaking to one person
- Include natural speech patterns with strategic pauses indicated by periods or commas
- Avoid complex sentences, jargon, or hard-to-pronounce words
- Create curiosity gaps and use storytelling elements
- End with impact: surprising conclusion, thought-provoking question, or actionable insight

TEXT-TO-SPEECH OPTIMIZATION:
- Write numbers as words (use "twenty-five" not "25")
- Use phonetically clear language and common pronunciations
- Include natural speech rhythm with varied sentence lengths
- Avoid abbreviations, acronyms, or special characters
- Structure sentences for natural breathing patterns
- Use emotional language that translates well to synthetic speech

CONTENT FOCUS:
- Prioritize engagement over comprehensive coverage
- Use relatable examples and analogies
- Include specific, memorable details
- Create "shareable moments" - facts people want to repeat
- Ensure each script offers a different angle or perspective on {{TOPIC}}

Format the response strictly as follows:
{
  "scripts": [
    {
      "content": "Script 1 text only, written for natural speech delivery."
    },
    {
      "content": "Script 2 text only, written for natural speech delivery."
    }
  ]
}

Do not include any commentary, explanations, hashtags, markdown formatting, or emojis outside of the JSON structure. Only include clean, speech-optimized text in the content fields.`;

export const IMAGE_PROMPT_SCRIPT = `
Generate detailed image prompts in the {{STYLE}} style for each key scene of a 30-second video.

Script: {{SCRIPT}}

Instructions:
- Focus solely on generating specific image prompts based on the narrative.
- Do NOT include camera angles or cinematographic terminology.
- Ensure each image prompt is vivid, descriptive, and reflects the emotional tone and setting of the scene.
- Return a maximum of 4 to 5 image prompts following the JSON schema below.
- Don't change the script
- Don't use the texts like Opening Scene, Closing Scene etc.

Schema:
[
  {
    "imagePrompt": "<Detailed visual description in the chosen style>",
    "sceneContent": "<The corresponding scene or moment from the script>"
  }
]
`;

export const YOUTUBE_METADATA_GENERATE_SCRIPT = `
I will provide a script or content. Based on that content, generate the following SEO metadata for youtube in JSON format:

{
  "title": "",
  "description": "",
  "tags": ["tag1", "tag2", "..."]
}

Instructions:
1. The title should be SEO-friendly, clear, and attention-grabbing (max 60 characters).
2. The description should summarize the main point, be compelling, and include important keywords (between 120–160 characters).
3. Generate 10 to 12 relevant tags that would help in ranking this content for search engines and social media platforms.

Content:
{{SCRIPT}}

`;



export const TITLE_GENERATE_PROMPT = `Generate a single, compelling title for the following content: {{CONTENT}}

TITLE REQUIREMENTS:
- Exactly 3-5 words maximum
- Capture the core hook or most surprising element from the content
- Use action words, power words, or emotional triggers when possible
- Optimize for click-through and engagement
- Avoid generic words like "amazing," "incredible," or "unbelievable"
- Focus on the specific benefit, revelation, or curiosity gap
- Use title case formatting
- Consider these proven formats: "Why [X] Happens," "The [X] Secret," "[X] That Changed Everything," "Hidden [X] Truth"

Return only the title in plain text with no additional formatting, explanations, or punctuation marks.`;



export const ENHANCE_PROMPT_SCRIPT = `
You are a prompt expert. Improve the following prompt to make it clearer, more useful, and effective.

Original Prompt:
{{PROMPT}}

Instructions:
1. Use clear, specific language—remove ambiguity and define the intent.
2. Add minimal context about the task or audience if needed.
3. Set basic constraints—tone, length, or what to avoid.
4. Keep the prompt concise. Preserve the original intent.

Return only the enhanced prompt as plain text. No markdown, no explanation, no formatting. Just as plain text no markdown also on the plain text.
`;



export const IMAGE_GENERATION_SCRIPT = `

{{TYPE}}
{{PROMPT}}

You are an expert image generation prompt analyzer. Analyze the TYPE and PROMPT provided above.

**ANALYSIS INSTRUCTIONS:**
1. Examine the prompt for visual requirements, style preferences, color schemes, and technical details.
2. Identify any explicit aspect ratio, image dimensions, or platform (default: YouTube).
3. Extract themes, visual elements, and artistic styles from the prompt content.
4. Determine suitable technical specifications based on the TYPE if not provided.

**TYPE-SPECIFIC REQUIREMENTS:**

**LOGO (YouTube Channel Icon):**
- Aspect Ratio: 1:1 (square format, displayed as circular on YouTube)
- Recommended Size: 800x800 pixels
- File Format: PNG, JPG, GIF, or BMP (max 2MB)
- Style: Clean, memorable, professional
- Design Note: Center key elements, avoid text near edges

**BANNER (YouTube Channel Art):**
- Aspect Ratio: 16:9 
- Recommended Size: 2560x1440 pixels
- Minimum Size: 2048x1152 pixels
- Safe Area: 1546x423 pixels (visible across all devices)
- Style: Bold, focused on central content, text inside safe area

**THUMBNAIL (YouTube Video Thumbnail):**
- Aspect Ratio: 16:9
- Recommended Size: 1280x720 pixels
- Minimum Width: 640 pixels
- File Format: PNG, JPG, GIF, or BMP (max 2MB)
- Style: High contrast, sharp focal points, mobile-readable

**PROMPT ENHANCEMENT RULES:**
- Maintain the original concept
- Add image quality specs: (e.g., 4K, ultra-detailed, sharp focus)
- Include lighting setups (studio, ambient, cinematic, etc.)
- Specify composition: rule of thirds, symmetrical, top-down, etc.
- Apply artistic style where applicable (digital art, minimalism, realism, etc.)
- Use vibrant, high-contrast color palettes unless otherwise stated
- Add platform (YouTube) and dimensions at the end of the prompt
- Remove any text generation from prompts (AI-generated text is poor quality)
- If user omits aspect ratio/dimensions, apply defaults based on TYPE

**DEFAULT TECHNICALS BY TYPE:**
- LOGO: 1:1, 800x800, PNG
- BANNER: 16:9, 2560x1440, PNG
- THUMBNAIL: 16:9, 1280x720, JPG
- Style Default: Modern, professional aesthetic
- Platform Default: YouTube

**OUTPUT FORMAT INSTRUCTIONS:**
1. Don’t modify the original prompt text
2. Append aspect ratio and size at the end of the prompt
3. Derive missing metadata using TYPE-based defaults
4. Ensure returned metadata is valid and platform-optimized

Return the result in this format as plain text (no markdown, no extra lines):

{
  "prompt": "<Don't modify the prompt. Just add the aspect ratio and size at the end based on image TYPE. If no aspect ratio is provided, use default for the image TYPE. Default platform is YouTube.>",
  "responseExtension": "<Based on image TYPE, e.g., png, jpg, etc.>"
}

Only return the above JSON structure. No extra comments, no markdown, no formatting.

`;
