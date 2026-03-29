const { Ollama } = require('ollama');
const dotenv = require('dotenv');
dotenv.config();

const ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' });
const MODEL = process.env.OLLAMA_MODEL || 'tinydolphin';

/**
 * Generates a structured Weekly Task Roadmap using TinyDolphin
 */
exports.generateRoadmap = async (formData) => {
  const { skill, goal, level, weeks } = formData;

  const systemPrompt = `You are a professional learning path architect.
Your goal is to create a weekly learning roadmap for a student.

OUTPUT RULES:
- Return ONLY a valid JSON object. 
- NO conversational text, NO markdown formatting (no \`\`\`json).
- The "tasks" array must contain exactly 3-4 tasks per week.
- Keep descriptions concise and practical.

JSON STRUCTURE:
{
  "title": "Mastering ${skill}",
  "skill": "${skill}",
  "totalWeeks": ${weeks},
  "tasks": [
    {
      "taskId": 1,
      "week": 1,
      "theme": "Introduction to ${skill}",
      "description": "Learn the basics of ${skill} and set up the environment.",
      "link": "https://www.google.com/search?q=${skill}+basics",
      "status": "Pending"
    }
  ]
}`;

  const userPrompt = `Create a ${weeks}-week roadmap for learning ${skill}. 
User Goal: ${goal}
Current Level: ${level}
Generate the JSON now.`;

  try {
    console.log(`🤖 Requesting roadmap from Ollama (${MODEL})...`);
    
    const response = await ollama.chat({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      format: 'json' // Enforce JSON if supported by the model/ollama version
    });

    const content = response.message.content.trim();
    
    // Clean potential markdown or extra text
    let cleanJSON = content;
    if (content.includes('```')) {
      cleanJSON = content.split('```')[1].replace('json', '').trim();
    }

    const parsedData = JSON.parse(cleanJSON);
    console.log('✅ AI roadmap generated successfully!');
    
    return parsedData;

  } catch (error) {
    console.error("❌ AI Service Error:", error);
    throw new Error(`AI generation failed: ${error.message}`);
  }
};
