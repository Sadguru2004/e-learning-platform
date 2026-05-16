import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchCourses } from '../services/searchService';
import CourseCard from '../components/courses/CourseCard';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setCourses([]);
      setLoading(false);
    }
  }, [query, filter]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    try {
      let results = await searchCourses(searchQuery);
      
      // Apply filters
      if (filter === 'my-courses' && user?.role === 'STUDENT') {
        // Filter only enrolled courses (you'll need to implement this)
        results = results.filter(course => course.isEnrolled);
      } else if (filter === 'popular') {
        results.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
      } else if (filter === 'newest') {
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      
      setCourses(results);
    } catch (error) {
      console.error('Search error:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery, selectedFilter) => {
    setFilter(selectedFilter);
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleFilter = (selectedFilter) => {
    setFilter(selectedFilter);
    if (query) {
      performSearch(query);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>

      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">
          {query ? `Search Results for "${query}"` : 'Search Courses'}
        </h1>
        <div className="flex justify-center">
          <SearchBar 
            onSearch={handleSearch}
            onFilter={handleFilter}
            placeholder="Search courses by title..."
          />
        </div>
      </div>

      {/* Results */}
      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {query ? 'No courses found' : 'Enter a search term'}
          </h3>
          <p className="text-gray-500">
            {query 
              ? `We couldn't find any courses matching "${query}". Try different keywords!`
              : 'Search for courses by title, instructor, or topic'}
          </p>
          {query && (
            <button
              onClick={() => {
                setSearchParams({});
                setCourses([]);
              }}
              className="mt-4 text-blue-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 text-gray-600">
            Found {courses.length} course{courses.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;