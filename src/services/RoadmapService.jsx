// RoadmapService.js
// Centralized service for handling all roadmap-related API calls and data management via local Node.js backend

const CONFIG = {
  // Local Express Backend URL
  BASE_URL: 'http://localhost:5000/api',
  
  // Polling configuration for checking roadmap generation status (deprecated with synchronous Ollama call)
  POLLING_INTERVAL: 8000, 
  MAX_POLLING_ATTEMPTS: 75, 
  INITIAL_POLLING_DELAY: 10000 
};

/**
 * Utility function to generate a unique User ID
 */
export const generateUserID = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `user_${timestamp}_${randomStr}`;
};

/**
 * Main service class for handling roadmap operations
 */
class RoadmapService {
  
  /**
   * Submit form data to local Node.js server for roadmap generation via Ollama
   * @param {Object} formData - User form data: skill, goal, level, weeks, userID, username, email
   */
  static async submitToPlanner(formData) {
    console.log('🤖 Submitting roadmap generation request to local AI (Ollama)...');
    
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/roadmaps/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
// ... (rest of the code remains the same as in the previous turn)

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Generation failed: ${response.status} - ${errorText}`);
      }

      const roadmapData = await response.json();
      console.log('✅ Local AI generated roadmap:', roadmapData);
      
      return { 
        success: true, 
        roadmap: roadmapData,
        isCompleted: true,
        message: 'Successfully generated roadmap via Ollama'
      };
      
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      throw new Error(`Failed to generate roadmap from local AI: ${error.message}`);
    }
  }

  /**
   * Fetch roadmap data for a specific user from local database
   * @param {string} userID - Unique user identifier
   */
  static async fetchRoadmapData(userID) {
    console.log('📊 Fetching roadmaps for user:', userID);
    
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/roadmaps/${userID}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Airtable fetch failed: ${response.status}`);
      }

      const roadmaps = await response.json();
      
      if (!roadmaps || roadmaps.length === 0) return null;

      // Return the most recent roadmap
      const activeRoadmap = roadmaps[0];
      
      return {
        ...activeRoadmap,
        tasks: activeRoadmap.tasks.map(task => ({
          ...task,
          id: task._id // Mapping MongoDB ID to internal ID
        }))
      };

    } catch (error) {
      console.error('❌ Failed to fetch roadmap data:', error);
      throw new Error(`Failed to fetch roadmap: ${error.message}`);
    }
  }

  /**
   * Update the status of a specific task in MongoDB
   */
  static async updateTaskStatus(recordId, status) {
    console.log('🔄 Updating task status in DB:', { recordId, status });
    
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/tasks/${recordId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Status update failed: ${response.status}`);
      }

      return await response.json();
      
    } catch (error) {
      console.error('❌ Status update error:', error);
      throw new Error(`Failed to update task: ${error.message}`);
    }
  }

  // Wrapper for polling (no longer needed but kept for component compatibility)
  static async pollForData(userID, onProgress, onSuccess, onError) {
    try {
      const data = await this.fetchRoadmapData(userID);
      if (data) onSuccess(data);
      else onError('No roadmap found for your profile.');
    } catch (err) {
      onError(err.message);
    }
  }

  static async fetchUserProfile(userID) {
    if (!userID) return null;
    console.log('👤 Fetching user profile from backend:', userID);
    
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/users/${userID}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Profile fetch failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch user profile:', error);
      return { userID, username: 'Logged In User' }; // Fallback
    }
  }

  /**
   * Specifically fetch the current skill the user is learning
   */
  static async fetchUserSkill(userID) {
    try {
      const profile = await this.fetchUserProfile(userID);
      return profile?.skill || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Update the user profile (Generic helper)
   */
  static async updateUserProfile(userID, data) {
    console.log('👤 Updating user profile:', { userID, ...data });
    
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/users/${userID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Profile update failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Failed to update user profile:', error);
      throw error;
    }
  }

  /**
   * Set initial username for a new user
   */
  static async updateNewUserToActualName(userID, username) {
    return await this.updateUserProfile(userID, { username });
  }

  /**
   * Update an existing username
   */
  static async updateUsername(userID, newUsername) {
    return await this.updateUserProfile(userID, { username: newUsername });
  }

  static async getTotalUsersCount() {
    return 1450; 
  }
}

export default RoadmapService;