import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter } from 'lucide-react';

const SearchBar = ({ onSearch, onFilter, placeholder = "Search courses...", showFilters = true }) => {
  const [query, setQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle search submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      onSearch(query.trim(), selectedFilter);
      setShowSuggestions(false);
    } else {
      onSearch('', selectedFilter);
    }
  };

  // Handle clear search
  const handleClear = () => {
    setQuery('');
    onSearch('', selectedFilter);
    setShowSuggestions(false);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    onFilter(filter);
    setIsFilterOpen(false);
    if (query.trim()) {
      onSearch(query.trim(), filter);
    } else {
      onSearch('', filter);
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full pl-12 pr-24 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {showFilters && (
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition ${
                selectedFilter !== 'all' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Filter className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (recentSearches.length > 0 || query) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          {query && (
            <div className="p-2 border-b border-gray-100">
              <button
                onClick={handleSubmit}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-3"
              >
                <Search className="h-4 w-4 text-gray-400" />
                <span>Search for "{query}"</span>
              </button>
            </div>
          )}
          {recentSearches.length > 0 && !query && (
            <div>
              <div className="px-3 py-2 text-xs text-gray-500">Recent Searches</div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search);
                    onSearch(search, selectedFilter);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-3"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <span>{search}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  localStorage.removeItem('recentSearches');
                  setRecentSearches([]);
                }}
                className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-gray-50"
              >
                Clear recent searches
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter Dropdown */}
      {isFilterOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 min-w-[200px]">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500">Filter by</div>
            <button
              onClick={() => handleFilterChange('all')}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 ${
                selectedFilter === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => handleFilterChange('my-courses')}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 ${
                selectedFilter === 'my-courses' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              My Enrolled Courses
            </button>
            <button
              onClick={() => handleFilterChange('popular')}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 ${
                selectedFilter === 'popular' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              Most Popular
            </button>
            <button
              onClick={() => handleFilterChange('newest')}
              className={`w-full text-left px-3 py-2 rounded-lg ${
                selectedFilter === 'newest' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              Newest First
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;