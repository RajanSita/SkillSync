import React, { useState, useEffect } from 'react';
import { BookOpen, Target, Clock, CheckCircle, AlertCircle, Users, Award, TrendingUp, Zap, ArrowRight, Globe, Star, X } from 'lucide-react';
import logo from '../assets/logo-trans.png';
// Import the theme hook from ThemeProvider
import { useTheme } from './ThemeProvider';
import RoadmapService from '../services/RoadmapService';
import RoadmapWarningModal from './06RoadmapWarningModal';

const generateUserID = () => {
  return 'user_' + Math.random().toString(36).substr(2, 9);
};

// --- UI COMPONENTS ---
const Button = ({ children, onClick, disabled, variant = 'primary', className = '', size = 'md', icon: Icon }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900';
  
  const variants = {
    primary: 'bg-[#5C946E] hover:bg-[#4a7a59] text-white focus:ring-[#5C946E] shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm',
    outline: 'bg-transparent border-2 border-[#5C946E] text-[#5C946E] hover:bg-[#5C946E] hover:text-white focus:ring-[#5C946E] dark:border-[#5C946E] dark:text-[#5C946E]'
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
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
        </div>
      )}
      <input
        {...props}
        className={`
          w-full border border-gray-300 rounded-lg py-2.5 px-3 
          ${Icon ? 'pl-10' : ''} 
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
    {error && <p className="text-sm text-red-600 dark:text-red-400 flex items-center transition-colors duration-200"><AlertCircle className="w-3 h-3 mr-1" />{error}</p>}
  </div>
);

const Select = ({ label, icon: Icon, options, error, className = '', ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
        </div>
      )}
      <select
        {...props}
        className={`
          w-full border border-gray-300 rounded-lg py-2.5 px-3 
          ${Icon ? 'pl-10' : ''} 
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#5C946E] focus:ring-[#5C946E] dark:border-gray-600 dark:focus:border-[#5C946E]'} 
          bg-white text-gray-900
          dark:bg-gray-800 dark:text-gray-100
          focus:ring-2 focus:ring-opacity-20 focus:outline-none
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          dark:disabled:bg-gray-700 dark:disabled:text-gray-400
          transition-all duration-200
          ${className}
        `}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
    {error && <p className="text-sm text-red-600 dark:text-red-400 flex items-center transition-colors duration-200"><AlertCircle className="w-3 h-3 mr-1" />{error}</p>}
  </div>
);

const StatusCard = ({ icon: Icon, title, message, variant = 'info', showSpinner = false }) => {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200'
  };

  return (
    <div className={`p-4 border rounded-lg transition-colors duration-200 ${variants[variant]}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {showSpinner ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
          ) : (
            <Icon className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{title}</h3>
          <p className="text-sm mt-1 opacity-90">{message}</p>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className={`animate-spin rounded-full ${sizes[size]} border-b-2 border-current`}></div>
  );
};

const TipItem = ({ icon: Icon, text }) => (
  <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors duration-200">
    <Icon className="w-4 h-4 text-[#5C946E] mt-0.5 flex-shrink-0" />
    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">{text}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors duration-200">
    <Icon className="w-5 h-5 text-[#5C946E] mt-0.5 flex-shrink-0" />
    <div>
      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{title}</h4>
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

// Add these skeleton components after the existing UI components
const SkeletonInput = () => (
  <div className="space-y-2">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
  </div>
);

const SkeletonButton = () => (
  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
);

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 animate-pulse">
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonInput />
        <SkeletonInput />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonInput />
        <SkeletonInput />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonInput />
      </div>
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <SkeletonButton />
      </div>
    </div>
  </div>
);

const SkeletonTipCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded mt-0.5"></div>
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- MAIN HOME COMPONENT ---
const RoadmapView = ({ 
  onRoadmapGenerated, 
  onSwitchToWorkplace, 
  // existingFormData = null,
  isGenerating = false,
  hasExistingRoadmap = false,
  currentUserID = null,
  onFirstTimeGeneration = null,
  isInitialPageLoad = false
}) => {
  // Use theme from context instead of local state
  const { isDarkMode } = useTheme();

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [window.location.hash])

  useEffect(() => {
    document.title = 'SkillSync - Generate Roadmap';
  }, []);

  // Generate initial UserID immediately
  const [initialUserID] = useState(() => generateUserID());

  // Form state with proper UserID initialization
  const [formData, setFormData] = useState({
    skill: '',
    userID: initialUserID,
    goal: 'Get a Job',
    level: 'Beginner',
    weeks: ''
  });

  // UI state
  const [formErrors, setFormErrors] = useState({});
  const [generationState, setGenerationState] = useState('idle'); // 'idle', 'submitting', 'polling', 'completed', 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(null);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(isInitialPageLoad);;

  // Modal state
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [hideWarningPreference, setHideWarningPreference] = useState(false);

  // Options for select fields
  const levelOptions = [
    { value: 'Beginner', label: 'Beginner - Just starting out' },
    { value: 'Intermediate', label: 'Intermediate - Some experience' },
    { value: 'Advanced', label: 'Advanced - Experienced learner' }
  ];

  const goalOptions = [
    { value: 'Get a Job', label: 'Get a Job - Career focused' },
    { value: 'Build a Project', label: 'Build a Project - Hands-on learning' },
    { value: 'Personal Growth', label: 'Personal Growth - Self improvement' },
    { value: 'Start a Business', label: 'Start a Business - Entrepreneurial' },
    { value: 'Academic Study', label: 'Academic Study - Educational' },
    { value: 'Skill Upgrade', label: 'Skill Upgrade - Professional development' }
  ];

  // Initialize "don't show again" preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('hideRoadmapWarning');
    if (savedPreference === 'true') {
      setHideWarningPreference(true);
    }
  }, []);

  // Sync generation state with parent
  useEffect(() => {
    if (isGenerating && generationState === 'idle') {
      setGenerationState('submitting');
      setStatusMessage('Processing your request...');
    }
  }, [isGenerating, generationState]);

  // Debug logging for UserID
  useEffect(() => {
    console.log('🔍 Home component UserID state:', {
      'formData.userID': formData.userID,
      'initialUserID': initialUserID,
      'currentUserID': currentUserID,
      'hasExistingRoadmap': hasExistingRoadmap
    });
  }, [formData.userID, initialUserID, currentUserID, hasExistingRoadmap]);

  // Add this useEffect to detect page load completion
  useEffect(() => {
  if (isInitialPageLoad) {
    setIsPageLoading(true);
    // The parent (MainApp) will control when this becomes false
  } else {
    setIsPageLoading(false);
  }
}, [isInitialPageLoad]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.skill.trim()) {
      errors.skill = 'Skill is required';
    } else if (formData.skill.trim().length < 2) {
      errors.skill = 'Skill must be at least 2 characters';
    }

    if (!formData.goal.trim()) {
      errors.goal = 'Learning goal is required';
    }

    if (!formData.level.trim()) {
      errors.level = 'Current level is required';
    }

    if (!formData.weeks.trim()) {
      errors.weeks = 'Number of weeks is required';
    } else if (isNaN(formData.weeks) || parseInt(formData.weeks) < 1 || parseInt(formData.weeks) > 12) {
      errors.weeks = 'Please enter a number between 1 and 12 weeks';
    }

    // Validate UserID
    if (!formData.userID || formData.userID.trim() === '') {
      console.warn('⚠️ UserID is missing during validation');
      // Regenerate UserID if missing
      const newUserID = generateUserID();
      setFormData(prev => ({ ...prev, userID: newUserID }));
      console.log('🔧 Generated new UserID during validation:', newUserID);
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Check if should show warning modal
  const shouldShowWarning = () => {
    return hasExistingRoadmap && !hideWarningPreference;
  };

  // Proceed with roadmap generation (called after modal confirmation or directly)
  const proceedWithGeneration = async (submissionData = null) => {
    const dataToSubmit = submissionData || formData;
    
    // Ensure UserID exists before proceeding
    if (!dataToSubmit.userID || dataToSubmit.userID.trim() === '') {
      const newUserID = generateUserID();
      dataToSubmit.userID = newUserID;
      console.log('🔧 Generated UserID before submission:', newUserID);
      
      // Update form state if using current formData
      if (!submissionData) {
        setFormData(prev => ({ ...prev, userID: newUserID }));
      }
    }
    
    setGenerationState('submitting');
    setStatusMessage('Submitting your request to AI planner...');
    setError(null);
    setSubmissionCount(prev => prev + 1);

    try {
      const finalSubmissionData = { ...dataToSubmit };
      
      console.log('🎯 Starting roadmap generation process...', finalSubmissionData);
      console.log('🔍 Final UserID being submitted:', finalSubmissionData.userID);

      const plannerResult = await RoadmapService.submitToPlanner(finalSubmissionData);
      console.log('📤 Planner result:', plannerResult);

      if (plannerResult.isCompleted) {
        console.log('✅ Planner reported completion, starting data fetch...');
        setGenerationState('polling');
        setStatusMessage('Planner completed! Fetching your roadmap data...');
        startDataPolling(finalSubmissionData.userID);
      } else {
        console.log('⏳ Planner still processing, waiting for completion...');
        setStatusMessage('AI is processing your request...');
        
        setTimeout(() => {
          setGenerationState('polling');
          setStatusMessage('Checking for completion and fetching data...');
          startDataPolling(finalSubmissionData.userID);
        }, 3000);
      }

      if (onRoadmapGenerated) {
        onRoadmapGenerated(finalSubmissionData);
      }

    } catch (err) {
      console.error('💥 Submission error:', err);
      setError(err.message);
      setGenerationState('error');
      setStatusMessage('');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!validateForm()) {
      return;
    }

    if (generationState !== 'idle') {
      return;
    }

    // Ensure UserID exists
    let submissionData = { ...formData };
    if (!submissionData.userID || submissionData.userID.trim() === '') {
      submissionData.userID = generateUserID();
      setFormData(prev => ({ ...prev, userID: submissionData.userID }));
      console.log('🔧 Generated UserID during submit:', submissionData.userID);
    }

    console.log('📝 Form submission data:', submissionData);

    // Check if we should show warning modal
    if (shouldShowWarning()) {
      setPendingFormData(submissionData);
      setShowWarningModal(true);
      return;
    }

    // Proceed directly if no warning needed
    await proceedWithGeneration(submissionData);
  };

  // Modal handlers
  const handleModalProceed = async () => {
    setShowWarningModal(false);
    if (pendingFormData) {
      await proceedWithGeneration(pendingFormData);
      setPendingFormData(null);
    }
  };

  const handleModalCancel = () => {
    setShowWarningModal(false);
    setPendingFormData(null);
  };

  const handleModalClose = () => {
    setShowWarningModal(false);
    setPendingFormData(null);
  };

  const handleDontShowAgain = (hide) => {
    setHideWarningPreference(hide);
    localStorage.setItem('hideRoadmapWarning', hide.toString());
  };

  // Start polling for roadmap data
  const startDataPolling = (userID) => {
    if (!userID || userID.trim() === '') {
      console.error('❌ Cannot start polling - UserID is missing');
      setError('UserID is missing - cannot fetch roadmap data');
      setGenerationState('error');
      return;
    }

    console.log('🚀 Starting data polling for UserID:', userID);

    RoadmapService.pollForData(
      userID,
      (message) => {
        setStatusMessage(message);
      },
      (roadmapData) => {
      console.log('🎉 Roadmap generation completed!', roadmapData);
      setGenerationState('completed');
      setStatusMessage('Roadmap generated successfully!');
      
      // Check if this is a first-time generation (no existing roadmap)
      const isFirstTime = !hasExistingRoadmap && !currentUserID;
      
      if (onRoadmapGenerated) {
        onRoadmapGenerated(formData, roadmapData);
      }
      
      // Notify MainApp if this is a first-time generation
      if (isFirstTime && onFirstTimeGeneration && formData.userID) {
        onFirstTimeGeneration(formData.userID, formData);
      }
      
      setTimeout(() => {
        resetForm();
        if (onSwitchToWorkplace) {
          onSwitchToWorkplace();
        }
      }, 1000);
    },
      (errorMessage) => {
        console.error('❌ Polling failed:', errorMessage);
        setError(errorMessage);
        setGenerationState('error');
        setStatusMessage('');
      }
    );
  };

  // Reset form and state
  const resetForm = () => {
    setGenerationState('idle');
    setError(null);
    setStatusMessage('');
    setFormErrors({});
    setSubmissionCount(0);
    
    const newUserID = generateUserID();
    setFormData(prev => ({
      skill: '',
      goal: 'Get a Job',
      level: 'Beginner',
      weeks: '',
      userID: newUserID
    }));
    
    console.log('🔄 Form reset with new UserID:', newUserID);
  };

  // Cancel generation process
  const cancelGeneration = () => {
    setGenerationState('idle');
    setStatusMessage('');
    setError(null);
  };

  // Check if form is in a processing state
  const isProcessing = ['submitting', 'polling'].includes(generationState);
  const isCompleted = generationState === 'completed';
  const hasError = generationState === 'error';

  if (isPageLoading) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header Skeleton */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1 space-y-4 animate-pulse">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-80 mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-80 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Form Skeleton */}
          <div className="lg:col-span-2">
            <SkeletonCard />
          </div>

          {/* Right Column - Tips Skeleton */}
          <div className="space-y-8">
            <SkeletonTipCard />
            
            {/* Quick Access Skeleton */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 p-6 text-center animate-pulse">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded mx-auto mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24 mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-24 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  return (
    
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Warning Modal */}
      <RoadmapWarningModal
        isOpen={showWarningModal}
        onClose={handleModalClose}
        onProceed={handleModalProceed}
        onCancel={handleModalCancel}
        onDontShowAgain={handleDontShowAgain}
      />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-7xl font-bold text-[#5C946E] mb-3" style={{userSelect: 'none'}}>
                SkillSync
              </h1>
              <p className="text-l text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-200">
                Create personalized learning roadmaps powered by artificial intelligence.
              </p>
              <p className="text-l text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-200">
                Get structured, week-by-week plans tailored to your goals and skill level.
              </p>
              {submissionCount > 0 && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#5C946E] bg-opacity-10 text-[#5C946E]">
                  <Clock className="w-4 h-4 mr-1" />
                  Generation Attempt #{submissionCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {/* Status Messages */}
            {isProcessing && (
              <div className="mb-8">
                <StatusCard
                  icon={Clock}
                  title={generationState === 'submitting' ? 'Processing Request' : 'Generating Roadmap'}
                  message={statusMessage}
                  variant="info"
                  showSpinner={true}
                />
              </div>
            )}

            {isCompleted && (
              <div className="mb-8">
                <StatusCard
                  icon={CheckCircle}
                  title="Success!"
                  message="Your roadmap has been generated successfully. Redirecting to workplace..."
                  variant="success"
                />
              </div>
            )}

            {hasError && (
              <div className="mb-8">
                <StatusCard
                  icon={AlertCircle}
                  title="Error"
                  message={error}
                  variant="error"
                />
              </div>
            )}

            {/* Main Form Card */}
            <div className="bg-[#c7dccd] dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200">
                  Create Your Learning Roadmap
                </h2>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  Fill in the details below to generate a personalized learning plan
                </p>
              </div>

              <div className="space-y-6">
                {/* First Row - Skill */}
                <div className="grid grid-cols-1 gap-6">
                  <Input
                    label="Skill to Learn"
                    icon={BookOpen}
                    name="skill"
                    value={formData.skill}
                    onChange={handleInputChange}
                    placeholder="e.g., Python for Data Science, React Development"
                    error={formErrors.skill}
                    disabled={isProcessing}
                    required
                  />
                </div>

                {/* Second Row - Level and Goal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Current Level"
                    icon={Target}
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    options={levelOptions}
                    error={formErrors.level}
                    disabled={isProcessing}
                  />

                  <Select
                    label="Learning Goal"
                    icon={Target}
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    options={goalOptions}
                    error={formErrors.goal}
                    disabled={isProcessing}
                  />
                </div>

                {/* Third Row - Weeks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Duration (Weeks)"
                    icon={Clock}
                    type="number"
                    name="weeks"
                    value={formData.weeks}
                    onChange={handleInputChange}
                    placeholder="1 to 12"
                    min="1"
                    max="12"
                    error={formErrors.weeks}
                    disabled={isProcessing}
                    required
                  />
                </div>

                {/* Debug Info (Development only) */}
                {formData.userID && process.env.NODE_ENV === 'development' && (
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors duration-200">
                    <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                      <div className="font-medium mb-1">Debug Information:</div>
                      <div>User ID: {formData.userID}</div>
                      <div>Initial ID: {initialUserID}</div>
                      <div>Current User ID: {currentUserID || 'None'}</div>
                      <div>State: {generationState}</div>
                      <div>Theme: {isDarkMode ? 'Dark' : 'Light'}</div>
                      <div>Has Existing Roadmap: {hasExistingRoadmap ? 'Yes' : 'No'}</div>
                      <div>Hide Warning: {hideWarningPreference ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
                  <div className="space-y-4">
                    {!isProcessing && !isCompleted && (
                      <Button
                        onClick={handleSubmit}
                        className="w-full"
                        disabled={isProcessing}
                        size="lg"
                        icon={isProcessing ? null : Zap}
                      >
                        {isProcessing ? (
                          <div className="flex items-center justify-center space-x-2">
                            <LoadingSpinner size="sm" />
                            <span>Generating Roadmap...</span>
                          </div>
                        ) : (
                          'Generate My Roadmap'
                        )}
                        
                      </Button>
                    )}

                    {isProcessing && (
                      <Button
                        onClick={cancelGeneration}
                        variant="secondary"
                        className="w-full"
                        size="lg"
                      >
                        Cancel Generation
                      </Button>
                    )}

                    {(hasError || isCompleted) && (
                      <div className="space-y-3">
                        <Button
                          onClick={resetForm}
                          className="w-full"
                          size="lg"
                          icon={Zap}
                        >
                          Generate New Roadmap
                        </Button>
                        
                        {isCompleted && onSwitchToWorkplace && (
                          <Button
                            onClick={onSwitchToWorkplace}
                            variant="outline"
                            className="w-full"
                            size="lg"
                            icon={ArrowRight}
                          >
                            View My Roadmap
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tips and Features */}
          <div className="space-y-8">
            
            {/* Tips Section */}
            <div className="bg-[#c7dccd] dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center transition-colors duration-200">
                <Star className="w-5 h-5 text-[#5C946E] mr-2" />
                Tips for Better Results
              </h3>
              <div className="space-y-3">
                <TipItem 
                  icon={BookOpen}
                  text="Be specific about the skill (e.g., 'React for Web Development' vs 'Programming')"
                />
                <TipItem 
                  icon={Target}
                  text="Choose the level that best matches your current knowledge"
                />
                <TipItem 
                  icon={Award}
                  text="Select a goal that aligns with your learning motivation"
                />
                <TipItem 
                  icon={Clock}
                  text="Choose 1-12 weeks based on your availability and depth needed"
                />
                <TipItem 
                  icon={Globe}
                  text="The AI generation process typically takes 1-2 minutes"
                />
              </div>
            </div>

            {/* Quick Access */}
            {onSwitchToWorkplace && (
              <div className="bg-[#c7dccd]/20 dark:bg-gray-800 rounded-xl border-2 border-dashed border-[#c7dccd] dark:border-gray-600 p-6 text-center transition-colors duration-300">
                <Users className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Already have a roadmap?
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-200">
                  Access your existing learning workspace
                </p>
                <Button
                  onClick={onSwitchToWorkplace}
                  variant="outline"
                  size="sm"
                  className="text-xs dark:hover:text-white"
                >
                  Go to Workplace
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;