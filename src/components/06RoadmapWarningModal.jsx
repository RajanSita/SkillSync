import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

// Button component (you might want to import this from a shared components file instead)
const Button = ({ children, onClick, disabled, variant = 'primary', className = '', size = 'md' }) => {
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
      {children}
    </button>
  );
};

const RoadmapWarningModal = ({ isOpen, onClose, onProceed, onCancel, onDontShowAgain }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleProceed = () => {
    if (dontShowAgain && onDontShowAgain) {
      onDontShowAgain(true);
    }
    onProceed();
  };

  const handleCancel = () => {
    if (dontShowAgain && onDontShowAgain) {
      onDontShowAgain(true);
    }
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" ></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-auto transform transition-all duration-300 border border-gray-200 dark:border-gray-700">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Content */}
          <div className="p-6">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">
              Replace Existing Roadmap?
            </h3>

            {/* Warning Messages */}
            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Having multiple roadmaps is not supported yet.
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-800 dark:text-red-200 font-medium text-center">
                  Your current roadmap will be lost if you create a new roadmap.
                </p>
              </div>
            </div>

            {/* Don't Show Again Checkbox */}
            <div className="mb-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-4 h-4 text-[#5C946E] border-gray-300 dark:border-gray-600 rounded focus:ring-[#5C946E] focus:ring-2 bg-white dark:bg-gray-700"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Don't show this warning again
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={handleCancel}
                variant="secondary"
                className="flex-1"
                size="md"
              >
                Cancel
              </Button>
              <Button
                onClick={handleProceed}
                variant="danger"
                className="flex-1"
                size="md"
              >
                Proceed Anyway
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapWarningModal;