const mongoose = require('mongoose');
const AIService = require('./services/aiService');
const dotenv = require('dotenv');

dotenv.config();

async function testAIService() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillsync');
    console.log('✅ Connected to MongoDB for testing...');

    const testData = {
      skill: 'Java',
      goal: 'Become a Backend Developer',
      motive: 'Job seeking',
      totalTime: '3 months',
      dailyTime: '2 hours',
      materialPreferences: ['Articles', 'Documentation']
    };

    console.log('🚀 Triggering AI Roadmap Generation...');
    const result = await AIService.generateRoadmap(testData);

    console.log('--- AI RESPONSE ---');
    console.log(JSON.stringify(result, null, 2));
    console.log('--------------------');

    if (result.tasks && result.tasks.length > 0) {
      console.log('✅ SUCCESS: Roadmap generated with tasks.');
      if (result.tasks[0].matchedResources && result.tasks[0].matchedResources.length > 0) {
        console.log('✅ SUCCESS: Resources matched and attached.');
      } else {
        console.log('⚠️ WARNING: No resources matched. Check tags in seed data.');
      }
    } else {
      console.log('❌ FAILURE: No tasks generated.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Test Error:', error);
    process.exit(1);
  }
}

testAIService();
