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
3. Define the desired output format (e.g., paragraph, list, steps).
4. Include one or two examples if they help clarify the goal.
5. Set basic constraints—tone, length, or what to avoid.
6. Keep the prompt concise but precise. Preserve the original intent.

Return only the enhanced prompt as plain text. No markdown, no explanation, no formatting.
`;



export const IMAGE_GENERATION_SCRIPT = `

{{TYPE}}
{{PROMPT}}

You are an expert image generation prompt analyzer. Analyze the TYPE and PROMPT provided above.

**ANALYSIS INSTRUCTIONS:**
1. Carefully examine the user's prompt for any specific visual requirements, style preferences, colors, or technical specifications
2. Identify if the user has mentioned aspect ratios, dimensions, or platform requirements
3. Extract key visual elements, themes, and artistic styles from the prompt
4. Determine the most appropriate technical specifications based on the image type

**TYPE-SPECIFIC REQUIREMENTS:**

**LOGO Requirements (YouTube Channel Icon):**
- Aspect Ratio: 1:1 (square format) - displays as circular on YouTube
- Recommended Size: 800x800 pixels
- File Format: JPG, PNG, GIF, or BMP (max 2MB)
- Style focus: Clean, memorable, professional, works well in circular crop
- Design considerations: Center important elements, avoid text near edges

**BANNER Requirements (YouTube Channel Art):**
- Aspect Ratio: 16:9 
- Recommended Size: 2560x1440 pixels (ideal for all devices including TV)
- Minimum Size: 2048x1152 pixels
- Safe Area: 1546x423 pixels (visible on all devices - keep text/logos here)
- Style focus: Eye-catching, text in safe area, works across devices
- Design considerations: Account for different device crops, focus content in center

**THUMBNAIL Requirements (YouTube Video Thumbnail):**
- Aspect Ratio: 16:9 (matches video player)
- Recommended Size: 1280x720 pixels
- Minimum Width: 640 pixels
- File Format: JPG, PNG, GIF, or BMP (max 2MB)
- Style focus: High contrast, clear focal points, readable at small sizes, mobile-friendly
- Design considerations: Eye-catching for feed visibility, avoid misleading content

**PROMPT ENHANCEMENT GUIDELINES:**
- Add technical quality descriptors (4K, ultra-detailed, professional quality, sharp focus)
- Include appropriate lighting specifications (studio lighting, natural light, dramatic lighting)
- Specify composition techniques (rule of thirds, centered composition, dynamic angle)
- Add relevant artistic styles based on content (photorealistic, digital art, minimalist, etc.)
- Include color enhancement terms (vibrant colors, high contrast, professional color grading)
- Add platform-specific optimizations for YouTube content
- Remove any text generation requests (AI image generators handle text poorly)
- Specify aspect ratio and dimensions in the enhanced prompt when not provided by user

**DEFAULT SPECIFICATIONS:**
- LOGO: 1:1 aspect ratio, 800x800 pixels (YouTube channel icon standard)
- BANNER: 16:9 aspect ratio, 2560x1440 pixels with safe area considerations
- THUMBNAIL: 16:9 aspect ratio, 1280x720 pixels (YouTube standard)
- If no style mentioned: Apply modern, professional aesthetic
- If no colors specified: Use vibrant, high-contrast palette suitable for YouTube
- Always optimize for YouTube platform specifications and device compatibility

**ENHANCEMENT PROCESS:**
1. Keep the core concept from the original prompt
2. Add technical quality and style improvements
3. Include appropriate aspect ratio specification
4. Add platform optimization details
5. Ensure the enhanced prompt will generate images suitable for YouTube use

Give me the metadata according to the TYPE and PROMPT. Analyze the prompt and try to extract the fields provided by the user. If not provided, use the defaults.

There can be different types: LOGO, BANNER, THUMBNAIL // For YouTube so be careful on aspect ratio and size

Return the metadata in this format as plain text:
{
  "prompt": "<modified prompt to generate the image with aspect ratio and size said on the prompt if no aspect ratio then said the default, default platform is youtube>",
  "responseExtension": "<based on image type e.g. png, jpg, etc.>",
}

Ensure the metadata is relevant to the type and prompt provided. If specific details are missing, use sensible defaults.
`;