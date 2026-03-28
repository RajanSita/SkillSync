import React from 'react';
import { Target, BookOpen, Trophy, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const GuestHome = ({ onLoginClick }) => {
  return (
    <div className="py-12 px-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-6 pt-10">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full mb-4 font-medium transition-colors">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Learning Paths</span>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white tracking-tight" style={{userSelect: 'none'}}>
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5C946E] to-[#4a805b]">SkillSync</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Generate highly personalized learning roadmaps based on your skills, goals, and availability. 
            Sign in with Google to get started.
          </p>
          <div className="pt-4 flex justify-center space-x-4">
            <button 
              onClick={onLoginClick}
              className="bg-[#5C946E] hover:bg-[#4a805b] text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:-translate-y-0.5"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Sign In with Google</span>
            </button>
            <button className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-8 py-3.5 rounded-xl font-semibold transition-all shadow-sm">
              Explore Resources
            </button>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="py-10">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Tell us your goals</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Input your current skills and target role. Our AI analyzes the gap between where you are and where you want to be.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Get a custom roadmap</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Receive a tailored structure of modules curated just for you, along with top resources recommended for each topic.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <Trophy className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Track your progress</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Maintain activity streaks, earn points on the leaderboard, and mark resources as completed to level up your career.
              </p>
            </div>
          </div>
        </div>

        {/* PREVIEW SECTIONS */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Resource Preview */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Curated Resources</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Browse our library of high-quality courses, articles, and videos.</p>
              
              <div className="space-y-3 opacity-70 cursor-not-allowed">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex items-center gap-4 border border-gray-100 dark:border-gray-700">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0"></div>
                    <div className="flex-1 space-y-2">
                       <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                       <div className="h-2 w-3/4 bg-gray-100 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center flex-col">
               <button onClick={onLoginClick} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-2.5 rounded-full font-medium shadow-xl border border-gray-200 dark:border-gray-600 flex items-center gap-2">
                 Sign In to Explore <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="bg-gradient-to-br from-[#c7dccd]/30 to-green-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-3xl border border-[#c7dccd] dark:border-gray-700 relative overflow-hidden">
             <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Global Scoreboard</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">See how you rank against other learners on SkillSync.</p>
              <div className="space-y-4 opacity-70">
                {['Master', 'Expert', 'Scholar'].map((role, i) => (
                  <div key={role} className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-400">#{i + 1}</span>
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Learner_***</span>
                    </div>
                    <span className="text-sm font-bold text-[#5C946E]">{1500 - (i*200)} pts</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center flex-col">
               <button onClick={onLoginClick} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-2.5 rounded-full font-medium shadow-xl border border-gray-200 dark:border-gray-600 flex items-center gap-2">
                 Sign In to Compete <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GuestHome;
