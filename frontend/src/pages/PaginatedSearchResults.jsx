import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchPaginatedCourses } from '../services/paginatedCourseService';
import CourseCard from '../components/courses/CourseCard';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BookOpen, ArrowLeft } from 'lucide-react';

const PaginatedSearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0
  });
  
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    if (query) {
      performSearch();
    } else {
      setCourses([]);
      setLoading(false);
    }
  }, [query, page]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const results = await searchPaginatedCourses(query, page - 1, 9);
      setCourses(results.content || []);
      setPagination({
        currentPage: results.number || 0,
        totalPages: results.totalPages || 0,
        totalElements: results.totalElements || 0
      });
    } catch (error) {
      console.error('Search error:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    if (searchQuery) {
      setSearchParams({ q: searchQuery, page: 1 });
    } else {
      setSearchParams({});
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ q: query, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        </div>
      ) : (
        <>
          <div className="mb-4 text-gray-600">
            Found {pagination.totalElements} course{pagination.totalElements !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          
          {/* Pagination Controls */}
          <Pagination
            currentPage={pagination.currentPage + 1}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default PaginatedSearchResults;