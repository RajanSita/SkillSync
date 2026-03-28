import React from 'react';
import { Trophy } from 'lucide-react';

const ScoreBoard = () => {
  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center py-20 bg-[#c7dccd] dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <Trophy className="h-16 w-16 text-[#5C946E] mx-auto mb-4" />
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Score Board
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Check your progress, leaderboard ranking, and unlocked achievements here!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
