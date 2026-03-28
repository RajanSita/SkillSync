import { useState, useEffect } from 'react';
import {
  Mail,
  ChevronDown,
  Zap,
  Heart,
  Linkedin,
  Github
} from 'lucide-react';

const Footer = ({ 
  onNavigate = null, 
  currentRoute = 'home',
  totalRoadmaps = null,
  className = '' 
}) => {
  // State for dropdown
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // State for stats animation
  const [animatedStats, setAnimatedStats] = useState({
    roadmaps: 0
  });

  // Sample stats - replace with real data
  const stats = {
    roadmaps: totalRoadmaps || 21
  };

  // Animate stats on mount
  useEffect(() => {
    const animateValue = (start, end, duration, callback) => {
      const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(start + (end - start) * progress);
        callback(value);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    };

    // Animate roadmaps stat
    animateValue(0, stats.roadmaps, 2000, (value) => 
      setAnimatedStats(prev => ({ ...prev, roadmaps: value }))
    );
  }, [stats.roadmaps]);

  /// Team members data
  const teamMembers = [
    { 
      name: 'Riya Mittal', 
      role: 'Lead Developer',
      linkedin: 'https://www.linkedin.com/in/-riya-mittal-',
      github: 'https://github.com/Riyamittal0156/'
    },
    { 
      name: 'Khushi Gupta', 
      role: 'AI Integration',
      linkedin: 'https://www.linkedin.com/in/khushi-gupta-523816322/',
      github: 'https://github.com/khushigupta89790'
    },
    { 
      name: 'Rajan', 
      role: 'Backend Developer',
      linkedin: 'https://www.linkedin.com/in/rajan-sita-110b97347',
      github: 'https://github.com/RajanSita'
    },
    { 
      name: 'Darshil Khandelwal', 
      role: 'Frontend Developer',
      linkedin: 'https://www.linkedin.com/in/darshil-khandelwal-59962b335/',
      github: 'https://github.com/DarshilKh'
    }
  ];

  // Handle navigation
  const handleNavigation = (route) => {
    if (onNavigate) {
      onNavigate(route);
    }
  };

  // Handle dropdown toggle with animation
  const toggleTeamDropdown = () => {
    if (isTeamDropdownOpen) {
      // Closing animation
      setIsAnimating(true);
      setTimeout(() => {
        setIsTeamDropdownOpen(false);
        setIsAnimating(false);
      }, 200); // Match the CSS transition duration
    } else {
      // Opening animation
      setIsTeamDropdownOpen(true);
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 200);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.team-dropdown') && isTeamDropdownOpen) {
        // Trigger closing animation
        setIsAnimating(true);
        setTimeout(() => {
          setIsTeamDropdownOpen(false);
          setIsAnimating(false);
        }, 200);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isTeamDropdownOpen]);

  return (
    <footer className={`bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1: Branding & Stats */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-[#5C946E] mb-2">
                  SkillSync
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-200">
                  AI-powered personalized learning roadmaps
                </p>
              </div>
              
              {/* Stats */}
              <div className="pt-2">
                <div className="flex items-center space-x-2">
                  <div className="text-lg font-bold text-[#5C946E]">
                    {animatedStats.roadmaps.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                    Roadmaps Created
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links & Contact */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider transition-colors duration-200">
                Quick Links
              </h4>
              <div className="space-y-3">
                <button
                  onClick={() => handleNavigation('home')}
                  className={`block text-sm transition-colors duration-200 text-left ${
                    currentRoute === 'home' 
                      ? 'text-[#5C946E] font-medium' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-[#5C946E] dark:hover:text-[#5C946E]'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation('workplace')}
                  className={`block text-sm transition-colors duration-200 text-left ${
                    currentRoute === 'workplace' 
                      ? 'text-[#5C946E] font-medium' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-[#5C946E] dark:hover:text-[#5C946E]'
                  }`}
                >
                  Workplace
                </button>
                
                {/* Contact Info */}
                <div className="pt-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                    <Mail className="w-4 h-4 text-[#5C946E]" />
                    <a 
                      href="mailto:skillsync.roadmap@gmail.com" 
                      className="hover:text-[#5C946E] transition-colors duration-200"
                    >
                      skillsync.roadmap@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Team Dropdown */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider transition-colors duration-200">
                Development Team
              </h4>
              <div className="relative team-dropdown">
                <button
                  onClick={toggleTeamDropdown}
                  className="flex items-center justify-between w-full text-left p-3 bg-[#c7dccd] dark:bg-gray-700 rounded-lg hover:bg-[#b2cfba] dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
                      TryCatchUs Group
                    </div>
                  </div>
                  <div className="transition-transform duration-200" style={{
                    transform: isTeamDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                </button>
                
                {/* Dropdown with smooth animation */}
                <div className={`absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10 transition-all duration-200 ease-in-out ${
                  isTeamDropdownOpen 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : isAnimating 
                      ? 'opacity-0 scale-95 translate-y-2' 
                      : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
                }`} style={{
                  maxHeight: isTeamDropdownOpen ? '400px' : '0px',
                  transitionProperty: 'opacity, transform, max-height',
                  overflow: isTeamDropdownOpen ? 'visible' : 'hidden'
                }}>
                  <div className="py-2">
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600">
                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
                        Development Team
                      </div>
                    </div>
                    {teamMembers.map((member, index) => (
                      <div key={index} className={`px-3 py-2 hover:bg-[#c7dccd] dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-between ${
                        isTeamDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`} style={{
                        transitionDelay: isTeamDropdownOpen ? `${index * 50}ms` : '0ms'
                      }}>
                        <div>
                          <div className="text-xs font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
                            {member.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            {member.role}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {member.github && (
                            <div className="relative group">
                              <a
                                href={member.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 dark:text-gray-400 hover:text-[#5C946E] dark:hover:text-[#5C946E] transition-all duration-200 hover:scale-110"
                                aria-label={`View ${member.name}'s GitHub profile`}
                              >
                                <Github className="w-4 h-4" />
                              </a>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-20">
                                GitHub Profile
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          )}
                          <div className="relative group">
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 dark:text-gray-400 hover:text-[#5C946E] dark:hover:text-[#5C946E] transition-all duration-200 hover:scale-110"
                              aria-label={`View ${member.name}'s LinkedIn profile`}
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-20">
                              LinkedIn Profile
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            
            {/* Copyright & Legal */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                © 2025 SkillSync. All rights reserved.
              </p>
            </div>

            {/* Powered By & Version */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                <Zap className="w-3 h-3 text-[#5C946E]" />
                <span>Powered by AI</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                <Heart className="w-3 h-3 text-red-500" />
                <span>Made with care</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded transition-colors duration-200">
                v1.1.3
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;