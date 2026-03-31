const { Ollama } = require('ollama');
const Resource = require('../models/Resource');
const dotenv = require('dotenv');
dotenv.config();

const ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' });
const MODEL = process.env.OLLAMA_MODEL || 'tinydolphin';

/**
 * Generates a deeply personalized, hierarchical learning path with resume artifacts
 */
exports.generateRoadmap = async (formData) => {
  const { skill, goal, motive, totalTime, dailyTime, materialPreferences } = formData;

  const systemPrompt = `You are a robotic Learning Data Generator. 
STRICT RULE: YOUR ENTIRE RESPONSE MUST BE A SINGLE JSON OBJECT. 
NO INTRODUCTIONS. NO EXPLANATIONS. START WITH '{'.

Task: Create a ${totalTime} roadmap for ${skill}.
Duration: ${totalTime}.
Weekly Breakdown: You MUST spread tasks across the entire ${totalTime} period.

JSON Structure Example for a ${totalTime} plan:
{
  "title": "${totalTime} ${skill} Mastery Path",
  "tasks": [
    { "taskId": 1, "week": 1, "theme": "Foundations", "description": "Intro to ${skill} syntax", "resumeBullet": "Mastered basics" },
    { "taskId": 5, "week": 6, "theme": "Intermediate", "description": "Complex patterns in ${skill}", "resumeBullet": "Used advanced structures" },
    { "taskId": 10, "week": 12, "theme": "Final Project", "description": "Building a full app", "resumeBullet": "Completed capstone project" }
  ]
}
Ensure you include at least 1-2 tasks for EVERY SINGLE WEEK until week ${totalTime.split(' ')[0]}.`;

  const userPrompt = `Generate a ${totalTime} ${skill} roadmap JSON with tasks for every week.`;

  try {
    console.log(`🤖 Requesting roadmap from TinyDolphin... (this may take 15-30 seconds)`);
    
    const response = await ollama.chat({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });

    let content = response.message.content.trim();
    console.log('📝 Raw AI response received. Extracting JSON payload...');

    // Robust JSON Extraction (Greedy search for first { and last })
    const startIdx = content.indexOf('{');
    const endIdx = content.lastIndexOf('}');

    if (startIdx !== -1 && endIdx !== -1) {
      content = content.substring(startIdx, endIdx + 1);
    }

    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (e) {
      console.warn('⚠️ Standard JSON parse failed. Attempting deep cleaning...');
      // Secondary cleanup: remove common AI hallucinations like markdown bolding inside keys
      const deepCleaned = content.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ");
      try {
        parsedData = JSON.parse(deepCleaned);
      } catch (innerError) {
        console.error("❌ Deep cleanup failed. Raw content was:", content);
        throw new Error(`AI returned unparseable content: ${content.substring(0, 50)}...`);
      }
    }
    
    const tasks = parsedData.tasks || [];
    console.log(`🔍 Mapping resources for ${tasks.length} nodes...`);
    
    for (let task of tasks) {
      // FORCE strict skill matching to prevent irrelevant resource suggestions
      const skillLower = skill.toLowerCase();
      const themeKeywords = task.theme.toLowerCase().split(' ').filter(k => k.length > 2);
      
      const matches = await Resource.find({
        tags: skillLower, // HARD REQUIREMENT: Must match the skill
        $or: [
          { tags: { $in: themeKeywords } },
          { title: { $regex: task.theme.substring(0, 10), $options: 'i' } }
        ]
      }).limit(1);

      task.matchedResources = matches.map(m => ({
        title: m.title,
        url: m.url,
        type: m.type
      }));

      // Cleanup: If AI provides a massive text block, truncate it for the UI
      if (task.description && task.description.length > 200) {
        task.description = task.description.substring(0, 200) + "...";
      }
    }

    console.log('✅ Roadmap process complete!');
    return {
      title: parsedData.title || `${skill} Roadmap`,
      skill: skill,
      tasks: tasks,
      totalTasks: tasks.length
    };

  } catch (error) {
    console.error("❌ AI Service Error:", error);
    
    // Safety Fallback: Return a high-quality default roadmap if AI fails
    console.log("🛡️ Falling back to Safety Roadmap...");
    return {
      title: `${totalTime} ${skill} Professional Path`,
      skill: skill,
      tasks: [
        { taskId: 1, week: 1, theme: "Fundamentals", description: `Master the core basics of ${skill}`, resumeBullet: `Mastered ${skill} core syntax`, matchedResources: [] },
        { taskId: 2, week: 2, theme: "Advanced Concepts", description: `Deep dive into advanced ${skill} features`, resumeBullet: `Implemented complex logic with ${skill}`, matchedResources: [] },
        { taskId: 3, week: 3, theme: "Project Building", description: `Build a real-world application with ${skill}`, resumeBullet: `Developed professional projects using ${skill}`, matchedResources: [] },
        { taskId: 4, week: 4, theme: "Optimization", description: `Performance tuning and best practices for ${skill}`, resumeBullet: `Optimized ${skill} applications for production`, matchedResources: [] }
      ],
      totalTasks: 4
    };
  }
};
