import React, { useState } from 'react';
import { ChevronDown, ArrowUpDown } from 'lucide-react';

const SortOptions = ({ onSort, currentSort = { by: 'id', dir: 'asc' } }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const sortOptions = [
    { label: 'Newest First', by: 'id', dir: 'desc' },
    { label: 'Oldest First', by: 'id', dir: 'asc' },
    { label: 'Title A-Z', by: 'title', dir: 'asc' },
    { label: 'Title Z-A', by: 'title', dir: 'desc' },
    { label: 'Most Lectures', by: 'totalLectures', dir: 'desc' },
    { label: 'Least Lectures', by: 'totalLectures', dir: 'asc' },
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.by === currentSort.by && opt.dir === currentSort.dir);
    return option ? option.label : 'Sort By';
  };

  const handleSort = (option) => {
    onSort(option.by, option.dir);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        <ArrowUpDown className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-700">{getCurrentSortLabel()}</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[200px]">
          <div className="py-2">
            {sortOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSort(option)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                  currentSort.by === option.by && currentSort.dir === option.dir
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortOptions;