import React, { useState } from 'react';
import { BookOpen, Search, Filter, Star, ExternalLink, PlayCircle, FileText, Code, Layout, Database, Cloud } from 'lucide-react';

const MOCK_RESOURCES = [
  { id: 1, title: 'Complete React Developer in 2024', type: 'Course', category: 'Web Development', rating: 4.8, students: '120k', provider: 'Udemy', icon: Code, color: 'text-blue-500' },
  { id: 2, title: 'JavaScript: The Good Parts', type: 'Book', category: 'Web Development', rating: 4.9, students: '500k+', provider: 'O\'Reilly', icon: FileText, color: 'text-yellow-500' },
  { id: 3, title: 'UI/UX Design Bootcamp', type: 'Course', category: 'Design', rating: 4.7, students: '85k', provider: 'Coursera', icon: Layout, color: 'text-purple-500' },
  { id: 4, title: 'Python for Data Science', type: 'Course', category: 'Data Science', rating: 4.9, students: '200k', provider: 'edX', icon: Database, color: 'text-green-500' },
  { id: 5, title: 'AWS Certified Solutions Architect', type: 'Video', category: 'Cloud', rating: 4.6, students: '300k', provider: 'A Cloud Guru', icon: Cloud, color: 'text-orange-500' },
  { id: 6, title: 'Advanced CSS and Sass', type: 'Course', category: 'Web Development', rating: 4.8, students: '150k', provider: 'Udemy', icon: Code, color: 'text-blue-400' },
];

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Design', 'Cloud'];

const ResourceLibrary = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = MOCK_RESOURCES.filter(resource => {
    const matchesCategory = activeCategory === 'All' || resource.category === activeCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-8 px-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-[#c7dccd] dark:bg-gray-800 rounded-3xl p-8 relative overflow-hidden border border-[#5C946E]/20 dark:border-gray-700">
          <div className="absolute top-0 right-0 -tr-translate-x-12 translate-y-12 opacity-10 pointer-events-none">
            <BookOpen className="w-48 h-48" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Resource Library
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Explore our curated collection of high-quality learning materials. Handpicked courses, books, and articles to accelerate your career growth.
            </p>
            
            {/* Search Bar */}
            <div className="relative flex items-center w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden focus-within:ring-2 focus-within:ring-[#5C946E] focus-within:border-transparent transition-all">
              <div className="pl-4 pr-3 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Search resources, topics, or providers..." 
                className="w-full py-3.5 pr-4 bg-transparent outline-none text-gray-700 dark:text-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories Tab */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 pr-4 border-r border-gray-200 dark:border-gray-700">
             <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
             <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Filters</span>
          </div>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-[#5C946E] text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <div 
                key={resource.id} 
                className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 ${resource.color}`}>
                    <resource.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {resource.type}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[#5C946E] transition-colors">
                  {resource.title}
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  By {resource.provider}
                </p>

                <div className="flex items-center justify-between text-sm mt-auto border-t border-gray-100 dark:border-gray-700 pt-4">
                  <div className="flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-200">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{resource.rating}</span>
                    <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">({resource.students})</span>
                  </div>
                  
                  <button className="flex items-center text-[#5C946E] hover:text-[#4a805b] font-medium transition-colors">
                    View <ExternalLink className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <div className="bg-gray-50 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No resources found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search query or filters.</p>
              <button 
                onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
                className="mt-4 text-[#5C946E] font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ResourceLibrary;
