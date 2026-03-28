const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'tinydolphin';

/**
 * Service to handle roadmap generation using local Ollama (Tiny Dolphin)
 */
class AIService {
  /**
   * Generates a structured roadmap using Tiny Dolphin
   * @param {Object} input - User input: skill, goal, level, weeks
   * @returns {Promise<Array>} Array of roadmap tasks
   */
  static async generateRoadmap(input) {
    const { skill, goal, level, weeks } = input;
    
    // Construct the prompt for Tiny Dolphin
    const systemPrompt = `You are an expert personalized learning assistant. Your task is to generate a comprehensive, structured learning roadmap for the skill of "${skill}".
The user's goal is: "${goal}".
Current expertise level: "${level}".
Duration: ${weeks} weeks.

You MUST respond ONLY with a valid JSON array of tasks. Each task object must follow this format:
{
  "taskId": <number>,
  "week": <number>,
  "theme": "<Short theme/topic name>",
  "description": "<Detailed learning action or topic to master>",
  "link": "<A relevant educational link or placeholder URL (e.g., https://example.com)>"
}

Ensure the roadmap is logically ordered by week and taskId. Do not include any conversational text, only the raw JSON.`;

    try {
      console.log(`🤖 Requesting roadmap for "${skill}" from Ollama...`);
      
      const response = await axios.post(OLLAMA_URL, {
        model: OLLAMA_MODEL,
        prompt: systemPrompt,
        stream: false
      });

      const responseText = response.data.response.trim();
      
      // Attempt to find and parse the JSON array
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('❌ AI response did not contain a valid JSON array:', responseText);
        throw new Error('AI failed to generate a valid roadmap structure.');
      }

      const tasks = JSON.parse(jsonMatch[0]);
      console.log(`✅ Successfully generated ${tasks.length} tasks via Ollama.`);
      return tasks;

    } catch (error) {
      console.error('❌ Ollama AI Generation Error:', error.message);
      throw new Error(`Failed to generate roadmap from local AI: ${error.message}`);
    }
  }
}

module.exports = AIService;
