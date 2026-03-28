import React, { useState, useEffect } from 'react';
import { 
  User, 
  Copy, 
  Check, 
  X, 
  AlertCircle, 
  Shield, 
  Star, 
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

// Mock theme hook for demo
const useTheme = () => ({ isDarkMode: false });

// --- UI COMPONENTS ---
const Button = ({ children, onClick, disabled, variant = 'primary', className = '', size = 'md', icon: Icon }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900';
  
  const variants = {
    primary: 'bg-[#5C946E] hover:bg-[#4a7a59] text-white focus:ring-[#5C946E] shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600',
    outline: 'bg-transparent border-2 border-[#5C946E] text-[#5C946E] hover:bg-[#5C946E] hover:text-white focus:ring-[#5C946E] dark:border-[#5C946E] dark:text-[#5C946E]',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2.5 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

const Input = ({ label, icon: Icon, error, className = '', ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
        </div>
      )}
      <input
        {...props}
        className={`
          w-full border border-gray-300 rounded-lg py-3 px-4 
          ${Icon ? 'pl-11' : ''} 
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#5C946E] focus:ring-[#5C946E] dark:border-gray-600 dark:focus:border-[#5C946E]'} 
          bg-white text-gray-900 placeholder-gray-400
          dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500
          focus:ring-2 focus:ring-opacity-20 focus:outline-none
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          dark:disabled:bg-gray-700 dark:disabled:text-gray-400
          transition-all duration-200
          ${className}
        `}
      />
    </div>
    {error && (
      <p className="text-sm text-red-600 dark:text-red-400 flex items-center transition-colors duration-200">
        <AlertCircle className="w-3 h-3 mr-1" />
        {error}
      </p>
    )}
  </div>
);

const CopyButton = ({ textToCopy, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center px-3 py-2 text-sm font-medium
        bg-gray-100 hover:bg-gray-200 text-gray-700
        dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300
        border border-gray-300 dark:border-gray-600
        rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-[#5C946E] focus:ring-opacity-20
        ${className}
      `}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </>
      )}
    </button>
  );
};

// --- MAIN MODAL COMPONENT ---
const UserSetupModal = ({ 
  isOpen = true, 
  onClose = () => {}, 
  onSave = (username) => console.log('Save:', username), 
  onSkip = () => console.log('Skip'),
  userID = 'user_12345_abcdef',
  isLoading = false,
  error = null
}) => {
  // Use theme from context
  const { isDarkMode } = useTheme();

  // Form state
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [showUserID, setShowUserID] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setUsernameError('');
      setShowUserID(false);
    }
  }, [isOpen]);

  // Generate a suggested username based on UserID
  const generateSuggestedUsername = () => {
    if (userID) {
      // Extract the last part of the userID for a cleaner suggestion
      const parts = userID.split('_');
      const lastPart = parts[parts.length - 1];
      return `Learner ${lastPart.substring(0, 6)}`;
    }
    return 'New Learner';
  };

  // Updated form validation to allow spaces
  const validateUsername = (value) => {
    if (!value.trim()) {
      return 'Username is required';
    }
    
    const trimmedValue = value.trim();
    
    if (trimmedValue.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    if (trimmedValue.length > 20) {
      return 'Username must be less than 20 characters';
    }
    
    // Updated regex to allow spaces along with letters, numbers, hyphens, and underscores
    if (!/^[a-zA-Z0-9_\-\s]+$/.test(trimmedValue)) {
      return 'Username can only contain letters, numbers, spaces, hyphens, and underscores';
    }
    
    // Check for multiple consecutive spaces (optional validation)
    if (/\s{2,}/.test(trimmedValue)) {
      return 'Username cannot contain multiple consecutive spaces';
    }
    
    return '';
  };

  // Handle input change
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    
    // Clear error when user starts typing
    if (usernameError) {
      setUsernameError('');
    }
  };

  // Handle save
  const handleSave = () => {
    const trimmedUsername = username.trim();
    const error = validateUsername(trimmedUsername);
    
    if (error) {
      setUsernameError(error);
      return;
    }

    onSave(trimmedUsername);
  };

  // Handle skip
  const handleSkip = () => {
    onSkip();
  };

  // Use suggested username
  const useSuggestedUsername = () => {
    const suggested = generateSuggestedUsername();
    setUsername(suggested);
    setUsernameError('');
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity duration-300" 
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-auto transform transition-all duration-300 border border-gray-200 dark:border-gray-700">
          
          {/* Close Button */}
          {!isLoading && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Modal Content */}
          <div className="p-8">
            {/* Welcome Header */}
            <div className="text-center mb-8">
              {/* Celebration Icons */}
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="relative">
                  <Star className="w-8 h-8 text-[#5C946E] animate-pulse" />
                  <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
                </div>
                <div className="w-12 h-12 bg-[#5C946E] bg-opacity-10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[#5C946E]" />
                </div>
                <div className="relative">
                  <Star className="w-8 h-8 text-[#5C946E] animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -left-1 animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>

              {/* Welcome Text */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome to SkillSync!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Congratulations! Your first learning roadmap has been created successfully. 
                Let's set up your profile to personalize your learning journey.
              </p>
            </div>

            {/* Username Section */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <User className="w-5 h-5 text-[#5C946E] mr-2" />
                  Choose Your Username
                </h3>
                
                <div className="space-y-4">
                  <Input
                    label="Enter a username for your profile"
                    icon={User}
                    value={username}
                    onChange={handleUsernameChange}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., Tech Learner 2024"
                    error={usernameError}
                    disabled={isLoading}
                    maxLength={20}
                  />
                  
                  {/* Username Helper */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      3-20 characters, letters, numbers, spaces, - and _ only
                    </span>
                    <button
                      onClick={useSuggestedUsername}
                      className="text-[#5C946E] hover:text-[#4a7a59] font-medium transition-colors"
                      disabled={isLoading}
                    >
                      Use suggested
                    </button>
                  </div>
                </div>
              </div>

              {/* UserID Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  Your Unique User ID
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            User ID:
                          </span>
                          <button
                            onClick={() => setShowUserID(!showUserID)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            {showUserID ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className="font-mono text-sm text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded px-3 py-2 break-all">
                          {showUserID ? userID : userID?.replace(/./g, '•')}
                        </div>
                      </div>
                      <CopyButton textToCopy={userID} />
                    </div>
                  </div>
                  
                  {/* Important Notice */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                          Important: Save this User ID!
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300 leading-relaxed">
                          This unique ID is your key to accessing your roadmaps. 
                          Save it somewhere safe - you'll need it to return to your learning progress.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isLoading || !username.trim()}
                  className="flex-1 order-2 sm:order-1"
                  size="lg"
                  icon={isLoading ? null : User}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Profile...</span>
                    </div>
                  ) : (
                    'Create My Profile'
                  )}
                </Button>
                
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  disabled={isLoading}
                  className="order-1 sm:order-2"
                  size="lg"
                >
                  Skip for Now
                </Button>
              </div>

              {/* Skip Notice */}
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 leading-relaxed">
                You can always set up your profile later from your workspace. 
                Your roadmap is saved and ready to go!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSetupModal;