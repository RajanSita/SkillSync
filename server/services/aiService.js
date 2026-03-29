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

  const systemPrompt = `You are an expert learning path architect.
Your job is to create a COMPREHENSIVE weekly learning roadmap for a student.

OUTPUT RULES:
- Return ONLY a valid JSON object. 
- NO conversational text, NO markdown tags.
- Generate content for EXACTLY ${weeks} weeks. No more, no less.
- Every single week from week 1 to week ${weeks} MUST be included in the "tasks" array.
- Each week should have 3 to 4 sequential tasks.
- Keep descriptions concise, actionable, and specific to the ${level} level.

STRICT JSON STRUCTURE EXAMPLE:
{
  "title": "Mastering ${skill}",
  "skill": "${skill}",
  "totalWeeks": ${weeks},
  "tasks": [
    {
      "taskId": 1,
      "week": 1,
      "theme": "Foundation",
      "description": "Task description here",
      "link": "https://google.com",
      "status": "Pending"
    }
  ]
}

Ensure the "week" field is an INTEGER (1, 2, 3...) for every task.`;

  const userPrompt = `Create a full ${weeks}-week roadmap for learning ${skill}. 
User Goal: ${goal}
Current Level: ${level}
Requirement: I need a complete plan that spans exactly ${weeks} weeks. 
Please ensure that you do not truncate the output and provide 3-4 tasks for every single week up to week ${weeks}.`;

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
