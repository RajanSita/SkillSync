import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { 
  Home, 
  Briefcase, 
  BarChart3, 
  FileText, 
  Settings, 
  User, 
  HelpCircle,
  LogIn, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Wifi,
  WifiOff,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sun,
  Moon,
  Palette,
  Monitor,
  Zap,
  Target,
  TrendingUp,
  Edit2,
  Eye,
  EyeOff,
  BookOpen,
  Trophy
} from 'lucide-react';

import logo from '../assets/logo-trans.png';
// --- THEME CONTEXT WITH LOCALSTORAGE ---
const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: 'light'
});

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to dark
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('skillsync-theme');
        if (savedTheme !== null) {
          return savedTheme === 'dark';
        }
      } catch (error) {
        console.warn('LocalStorage not available, using default theme');
      }
    }
    return true; // Default to dark theme
  });

  // Update DOM classes and save to localStorage when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save theme preference to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('skillsync-theme', isDarkMode ? 'dark' : 'light');
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = isDarkMode ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// --- ICON MAPPING FOR ROUTES ---
const ROUTE_ICONS = {
  'home': Home,
  'workplace': Briefcase,
  'dashboard': BarChart3,
  'assignments': FileText,
  'analytics': BarChart3,
  'reports': FileText,
  'roadmap': Target,
  'resourceLibrary': BookOpen,
  'scoreBoard': Trophy,
  'progress': TrendingUp,
  'settings': Settings,
  'profile': User,
};

// --- TOOLTIP COMPONENT ---
const Tooltip = ({ children, content, isVisible }) => {
  if (!isVisible) return children;

  return (
    <div className="relative group">
      {children}
      <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-200 text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-gray-700 dark:border-gray-600">
        {content}
        <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800 dark:border-r-gray-700"></div>
      </div>
    </div>
  );
};

// --- THEME TOGGLE SECTION COMPONENT ---
const ThemeToggleSection = ({ isExpanded }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 p-3">
      <Tooltip content={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`} isVisible={!isExpanded}>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white group"
          title={!isExpanded ? `Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode` : undefined}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white transition-colors duration-200" />
          ) : (
            <Moon className="h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white transition-colors duration-200" />
          )}
          {isExpanded && (
            <div className="min-w-0 flex-1">
              <span className="font-medium truncate block">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
              <span className="text-xs opacity-75 truncate block">
                {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              </span>
            </div>
          )}
          {isExpanded && (
            <div className="flex-shrink-0">
              <Palette className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          )}
        </button>
      </Tooltip>
    </div>
  );
};

// --- STATUS INDICATOR COMPONENT ---
const StatusIndicator = ({ 
  connectionStatus, 
  isGenerating, 
  generationProgress, 
  hasRoadmap, 
  lastUpdate,
  isExpanded 
}) => {
  if (!isExpanded) return null;

  const getStatusColor = () => {
    if (connectionStatus === 'offline') return 'text-red-500 dark:text-red-400';
    if (isGenerating) return 'text-blue-600 dark:text-blue-400';
    if (hasRoadmap) return 'text-green-600 dark:text-green-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const getStatusIcon = () => {
    if (connectionStatus === 'offline') return WifiOff;
    if (isGenerating) return RefreshCw;
    if (hasRoadmap) return CheckCircle;
    return Clock;
  };

  const getStatusText = () => {
    if (connectionStatus === 'offline') return 'Offline';
    if (isGenerating) return generationProgress || 'Generating...';
    if (hasRoadmap) return 'Roadmap Ready';
    return 'No Roadmap';
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-2 text-xs">
        <StatusIcon 
          className={`h-3 w-3 ${getStatusColor()} ${isGenerating ? 'animate-spin' : ''} transition-colors duration-200`} 
        />
        <span className={`${getStatusColor()} truncate flex-1 transition-colors duration-200`}>
          {getStatusText()}
        </span>
      </div>
      {lastUpdate && hasRoadmap && !isGenerating && (
        <div className="text-xs text-gray-500 dark:text-gray-600 mt-1 truncate transition-colors duration-200">
          Updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

const ClearSessionWarning = ({ onConfirm, onCancel }) => {
  const handleConfirm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔘 Modal Confirm button clicked');
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm();
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔘 Modal Cancel button clicked');
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel(e);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-red-200 dark:border-red-800 p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 dark:text-red-200 text-lg">
              Do you want to Log Out?
            </h3>
            <p className="text-red-600 dark:text-red-300 text-sm mt-2">
              You can log-in again at any point using your user ID only. 
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button 
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const ProfileDropdown = ({ isOpen, onClose, isExpanded, userID, username, onUsernameUpdate, onClearSession, onShowSignInModal, isSigningIn }) => {
  const dropdownRef = useRef(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editingUsername, setEditingUsername] = useState(username || '');
  const [showUserID, setShowUserID] = useState(false);
  const [showClearWarning, setShowClearWarning] = useState(false);

  // Update editingUsername when username prop changes
  useEffect(() => {
    setEditingUsername(username || '');
  }, [username]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Don't close if the clear warning modal is open
        if (!showClearWarning) {
          onClose();
        }
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showClearWarning) {
          setShowClearWarning(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, showClearWarning]);

  // Handler functions for username editing
  const handleSaveUsername = async () => {
    if (editingUsername.trim() && editingUsername.trim() !== username) {
      try {
        if (onUsernameUpdate) {
          await onUsernameUpdate(editingUsername.trim());
        }
        setIsEditingUsername(false);
      } catch (error) {
        console.error('Failed to update username:', error);
        // You can add error handling here
      }
    } else {
      setIsEditingUsername(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUsername(username || '');
    setIsEditingUsername(false);
  };

  if (!isOpen) return null;

  // Generate user initials from username or default to 'U'
  const getUserInitials = () => {
    if (username && username.trim() && username !== 'Guest User') {
      const trimmedName = username.trim();
      // Split by underscore, hyphen, or whitespace
      const words = trimmedName.split(/[_\-\s]+/).filter(word => word.length > 0);
      
      if (words.length >= 2) {
        // Two or more words: take first character of first two words
        return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
      } else if (words.length === 1) {
        // One word: take first character
        return words[0].charAt(0).toUpperCase();
      }
    }
    
    // Default fallback
    return 'U';
  };

  return (
    <div
      ref={dropdownRef}
      className={`absolute ${isExpanded ? 'left-0 right-0' : 'left-full ml-2'} bottom-full mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 min-w-48 transition-colors duration-200`}
    >
      {/* User Info Section */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#5C946E] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-xs">{getUserInitials()}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <p className="text-gray-800 dark:text-white font-medium text-sm truncate transition-colors duration-200">
                {username || 'Guest User'}
              </p>
              {username && (
                <button
                  onClick={() => setIsEditingUsername(true)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Edit username"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-gray-500 dark:text-gray-400 text-xs truncate transition-colors duration-200 flex-1">
                {userID ? (
                  <>
                    ID: {showUserID ? userID : '•'.repeat(Math.min(userID.length, 24))}
                  </>
                ) : (
                  'Guest User'
                )}
              </p>
              {userID && (
                <button
                  onClick={() => setShowUserID(!showUserID)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                  title={showUserID ? 'Hide User ID' : 'Show User ID'}
                >
                  {showUserID ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Inline Username Editor */}
        {isEditingUsername && (
          <div className="mt-3 space-y-2">
            <input
              type="text"
              value={editingUsername}
              onChange={(e) => setEditingUsername(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="Enter username"
              maxLength={20}
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSaveUsername}
                className="px-2 py-1 text-xs bg-[#5C946E] text-white rounded hover:bg-[#4a7d59] transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-2 py-1 text-xs bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="py-1">
        <div className="w-full px-4 py-3 text-left text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed transition-colors duration-150 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="h-4 w-4 flex-shrink-0" />
            <span>Profile Settings</span>
          </div>
          <div className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded transition-colors duration-200">Soon</div>
        </div>
        <div className="w-full px-4 py-3 text-left text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed transition-colors duration-150 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="h-4 w-4 flex-shrink-0" />
            <span>Preferences</span>
          </div>
          <div className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded transition-colors duration-200">Soon</div>
        </div>
        <div className="w-full px-4 py-3 text-left text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed transition-colors duration-150 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HelpCircle className="h-4 w-4 flex-shrink-0" />
            <span>Help & Support</span>
          </div>
          <div className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded transition-colors duration-200">Soon</div>
        </div>
        <hr className="my-1 border-gray-200 dark:border-gray-700" />
        <div className="relative">
          {/* Sign In Option - only show when not signed in */}
          {!userID && (
            <button 
              onClick={onShowSignInModal} // USE THE PROP HERE
              disabled={isSigningIn} // ADD LOADING STATE
              className="w-full px-4 py-3 text-left text-sm text-[#5C946E] hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-150 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="h-4 w-4 flex-shrink-0" />
              <span>{isSigningIn ? 'Signing In...' : 'Sign In'}</span>
            </button>
          )}
          {userID && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔘 Logout button clicked');
                setShowClearWarning(true);
              }}
              className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-150 flex items-center space-x-3"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span>Log Out</span>
            </button>
          )}
        </div>

        {/* Warning Modal - Move outside of the dropdown div */}
        {showClearWarning && (
          <ClearSessionWarning 
            onConfirm={() => {
              console.log('✅ User confirmed logout');
              setShowClearWarning(false);
              onClose(); // Close dropdown first
              
              // Call the actual clear session function from MainApp
              if (onClearSession && typeof onClearSession === 'function') {
                console.log('🔄 Calling onClearSession...');
                onClearSession();
              } else {
                console.error('❌ onClearSession is not a function:', onClearSession);
              }
            }}
            onCancel={() => {
              console.log('❌ User cancelled logout');
              setShowClearWarning(false);
              // Keep dropdown open so user can try other actions
            }}
          />
        )}
              </div>
            </div>
          );
        };

// --- MAIN NAVBAR/SIDEBAR COMPONENT ---
const Navbar = ({ 
  activeTab = 'home',
  onTabChange,
  isInitialPageLoad = false,
  tabs = [
    { id: 'home', label: 'Home', description: 'Generate new roadmaps' },
    { id: 'roadmap', label: 'My Roadmap', description: 'View current learning path' },
    { id: 'progress', label: 'Progress', description: 'Track your learning' },
    { id: 'workplace', label: 'Workplace', description: 'Learning workspace' }
  ],
  userID = null,
  username = null,
  onUsernameUpdate = null,
  onClearSession = null,
  connectionStatus = 'online',
  lastUpdate = null,
  hasRoadmap = false,
  isGenerating = false,
  generationProgress = '',
  showSignInModal,
  onShowSignInModal,
  onSignIn,
  isSigningIn
}) => {
  // Get theme from context
  const { isDarkMode } = useTheme();
  
  // Component state
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Handle tab navigation
  const handleTabClick = (tabId) => {
    if (onTabChange && typeof onTabChange === 'function') {
      onTabChange(tabId);
    }
    // Close profile dropdown when navigating
    setIsProfileDropdownOpen(false);
  };

  // Toggle sidebar expansion
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    setIsProfileDropdownOpen(false);
  };

  // Handle profile dropdown
  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Generate user initials from username or default to 'U'
  const getUserInitials = () => {
    if (username && username.trim() && username !== 'Guest User') {
      const trimmedName = username.trim();
      // Split by underscore, hyphen, or whitespace
      const words = trimmedName.split(/[_\-\s]+/).filter(word => word.length > 0);
      
      if (words.length >= 2) {
        // Two or more words: take first character of first two words
        return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
      } else if (words.length === 1) {
        // One word: take first character
        return words[0].charAt(0).toUpperCase();
      }
    }
    
    // Default fallback
    return 'U';
  };

  // Get display name
  const getDisplayName = () => {
    if (username && username.trim() && username !== 'Guest User') {
      return username;
    }
    if (userID) {
      return 'Learning Session';
    }
    return 'Guest User';
  };

  // Get user role/status
  const getUserRole = () => {
    if (isGenerating) return 'Generating...';
    if (hasRoadmap) return 'Active Learner';
    return 'Getting Started';
  };

  // Skeleton Loading Components
  const SkeletonNavItem = () => (
    <div className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg">
      <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse flex-shrink-0"></div>
      {isExpanded && (
        <div className="min-w-0 flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-3/4"></div>
        </div>
      )}
    </div>
  );

  const SkeletonProfile = () => (
    <div className="flex items-center space-x-3 px-3 py-3">
      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0"></div>
      {isExpanded && (
        <div className="min-w-0 flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-2/3"></div>
        </div>
      )}
    </div>
  );

  // Show skeleton loading during initial page load
  if (isInitialPageLoad) {
    return (
      <ThemeProvider>
        <div 
          className={`${isExpanded ? 'w-64' : 'w-16'} bg-[#c7dccd] dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out flex flex-col h-screen flex-shrink-0 sticky top-0 z-50`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {/* Header Skeleton */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse flex-shrink-0"></div>
                {isExpanded && (
                  <div className="min-w-0 flex-1">
                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-3/4"></div>
                  </div>
                )}
              </div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Navigation Skeleton */}
          <nav className="flex-1 py-4">
            <div className="space-y-1 px-3">
              {[1, 2, 3].map((i) => (
                <SkeletonNavItem key={i} />
              ))}
            </div>
          </nav>

          {/* Bottom Sections Skeleton */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-3">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 p-3">
            <SkeletonProfile />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div 
        className={`${isExpanded ? 'w-64' : 'w-16'} bg-[#c7dccd] dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out flex flex-col h-screen flex-shrink-0 sticky top-0 z-50`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false);
          setIsProfileDropdownOpen(false);
        }}
      >
        {/* Header Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 min-w-0" style={{userSelect: 'none'}}>
              <div className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center flex-shrink-0">
                <img src={logo} className="h-9 w-9" />
              </div>
              {isExpanded && (
                <div className="min-w-0 flex-1">
                  <h1 className="text-gray-800 dark:text-white font-bold text-lg truncate transition-colors duration-200">SkillSync</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-xs truncate transition-colors duration-200">Learning Platform</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4">
          <div className="space-y-1 px-3">
            {tabs.map((tab) => {
              // Protect logged-in routes
              if (!userID && tab.id !== 'home') return null;

              const IconComponent = ROUTE_ICONS[tab.id] || FileText;
              const isActive = activeTab === tab.id;
              
              return (
                <Tooltip key={tab.id} content={`${tab.label}${tab.description ? ' - ' + tab.description : ''}`} isVisible={!isExpanded}>
                  <button
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group ${
                      isActive
                        ? 'bg-[#5C946E] text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white'
                    }`}
                    title={!isExpanded ? `${tab.label}${tab.description ? ' - ' + tab.description : ''}` : undefined}
                  >
                    <IconComponent 
                      className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white'
                      }`} 
                    />
                    {isExpanded && (
                      <div className="min-w-0 flex-1">
                        <span className="font-medium truncate block">{tab.label}</span>
                        {tab.description && (
                          <span className="text-xs opacity-75 truncate block">
                            {tab.description}
                          </span>
                        )}
                      </div>
                    )}
                    {isActive && isExpanded && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    )}
                  </button>
                </Tooltip>
              );
            })}
          </div>

          {/* Coming Soon Items (if expanded) */}
          {isExpanded && tabs.length < 6 && (
            <div className="mt-6 px-3">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-3 px-3 transition-colors duration-200">
                Coming Soon
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-400 dark:text-gray-500 cursor-not-allowed transition-colors duration-200">
                  <FileText className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium truncate">Resume and Cirtificate</span>
                  <div className="ml-auto text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded transition-colors duration-200">Soon</div>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Status Section */}
        <StatusIndicator
          connectionStatus={connectionStatus}
          isGenerating={isGenerating}
          generationProgress={generationProgress}
          hasRoadmap={hasRoadmap}
          lastUpdate={lastUpdate}
          isExpanded={isExpanded}
        />

        {/* Theme Toggle Section */}
        <ThemeToggleSection isExpanded={isExpanded} />

        {/* Bottom Section - User Profile */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-3 relative transition-colors duration-200">
          {/* Profile Button */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white group ${
                isProfileDropdownOpen ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white' : ''
              }`}
            >
              <div className="w-8 h-8 bg-[#5C946E] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-xs">{getUserInitials()}</span>
              </div>
              {isExpanded && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {username && username.trim() && username !== 'Guest User' ? username : 'Guest User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate transition-colors duration-200">{getUserRole()}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      connectionStatus === 'online' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                </>
              )}
            </button>

            {/* Profile Dropdown */}
            <ProfileDropdown
              isOpen={isProfileDropdownOpen}
              onClose={() => setIsProfileDropdownOpen(false)}
              isExpanded={isExpanded}
              userID={userID}
              username={username}
              onUsernameUpdate={onUsernameUpdate}
              onClearSession={onClearSession}
              onShowSignInModal={onShowSignInModal}
              isSigningIn={isSigningIn}
            />
          </div>

          {/* Version Info */}
          {isExpanded && (
            <div className="mt-3 px-3">
              <div className="text-xs text-gray-500 dark:text-gray-600 text-center transition-colors duration-200">
                SkillSync v1.1.3 • IBM Project
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Navbar;