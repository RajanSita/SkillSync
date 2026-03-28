import React from 'react';
import { Target, ArrowRight, Clock, Star, TrendingUp, Trophy } from 'lucide-react';

const LoggedHome = ({ username, roadmapData, onNavigate }) => {
  return (
    <div className="py-10 px-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* WELCOME HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, <span className="text-[#5C946E]">{username || 'Learner'}</span>! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ready to continue your journey? You're making great progress.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('workplace')}
            className="mt-4 md:mt-0 bg-[#5C946E] hover:bg-[#4a805b] text-white px-6 py-3 rounded-xl font-medium shadow-md transition-colors flex items-center gap-2"
          >
            Go to Workspace <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* MAIN COLUMN (Roadmap Activity) */}
          <div className="lg:col-span-2 space-y-8">
            {/* CURRENT ROADMAP SNAPSHOT */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3 text-gray-900 dark:text-white font-semibold">
                  <Target className="w-5 h-5 text-[#5C946E]" />
                  Active Learning Path
                </div>
                {roadmapData && (
                  <span className="text-xs font-bold px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                    IN PROGRESS
                  </span>
                )}
              </div>
              
              <div className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/50">
                {roadmapData ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{roadmapData.roadmapTitle || 'Your Roadmap'}</h3>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                      <div className="bg-[#5C946E] h-2.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>45% Completed</span>
                      <span>Next: Module 3</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Active Roadmap</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm max-w-sm mx-auto">Create a personalized learning path to kickstart your journey.</p>
                    <button 
                      onClick={() => onNavigate('roadmap')}
                      className="text-[#5C946E] font-medium border border-[#5C946E] px-6 py-2 rounded-lg hover:bg-[#5C946E] hover:text-white transition-colors"
                    >
                      Generate Roadmap
                    </button>
                  </div>
                )}
              </div>
            </div>

             {/* RECENT RESOURCES */}
             <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold mb-6">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Last Viewed Resources
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shrink-0">
                        <Star className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">Introduction to the concept {i}</h4>
                        <p className="text-xs text-gray-500 mt-1">Video • 10 mins</p>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>

          {/* SIDE COLUMN (Stats and Scoreboard) */}
          <div className="space-y-8">
            
            {/* QUICK STATS */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-gradient-to-br from-green-500 to-[#5C946E] text-white p-5 rounded-2xl shadow-md">
                 <TrendingUp className="w-6 h-6 mb-3 text-white/80" />
                 <div className="text-3xl font-bold mb-1">12</div>
                 <div className="text-sm text-white/90 font-medium">Day Streak</div>
               </div>
               <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 rounded-2xl shadow-sm">
                 <Target className="w-6 h-6 mb-3 text-purple-500" />
                 <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">8</div>
                 <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Modules Done</div>
               </div>
            </div>

            {/* PERSONAL SCOREBOARD */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Trophy className="w-24 h-24" />
              </div>
              
              <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold mb-6">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Your Rank
              </div>
              
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-3 ring-4 ring-yellow-50 dark:ring-yellow-900/10">
                  <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">14</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Gold Tier</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Top 15% of learners</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Points</span>
                  <span className="font-bold text-gray-900 dark:text-white">2,450 pts</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Next Tier At</span>
                  <span className="font-bold text-gray-900 dark:text-white">3,000 pts</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoggedHome;
