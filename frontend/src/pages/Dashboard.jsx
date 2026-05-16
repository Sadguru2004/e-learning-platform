import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllCourses } from '../services/courseService';
import { getMyEnrolledCourses } from '../services/enrollmentService';
import { getPaginatedCourses } from '../services/paginatedCourseService';
import CourseCard from '../components/courses/CourseCard';
import Pagination from '../components/common/Pagination';
import SortOptions from '../components/common/SortOptions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PlusCircle, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 9
  });
  const [sort, setSort] = useState({ by: 'id', dir: 'desc' });
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [pagination.currentPage, sort]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch paginated courses for students and guests
      if (user?.role === 'STUDENT' || !user) {
        const coursesData = await getPaginatedCourses(
          pagination.currentPage, 
          pagination.pageSize, 
          sort.by, 
          sort.dir
        );
        
        setAllCourses(coursesData.content || []);
        setPagination({
          currentPage: coursesData.number || 0,
          totalPages: coursesData.totalPages || 0,
          totalElements: coursesData.totalElements || 0,
          pageSize: pagination.pageSize
        });
      } else {
        // For instructors and admins, get all courses (no pagination needed for management)
        const courses = await getAllCourses();
        setAllCourses(Array.isArray(courses) ? courses : []);
      }
      
      // Fetch enrolled courses if user is student
      if (user?.role === 'STUDENT') {
        const enrolled = await getMyEnrolledCourses();
        setEnrolledCourses(Array.isArray(enrolled) ? enrolled : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
      setAllCourses([]);
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle course deletion
  const handleCourseDelete = (deletedCourseId) => {
    setAllCourses(prevCourses => prevCourses.filter(course => course?.id !== deletedCourseId));
    toast.success('Course removed from list');
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage - 1 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sort change
  const handleSortChange = (sortBy, sortDir) => {
    setSort({ by: sortBy, dir: sortDir });
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Safely get instructor's courses
  const myCourses = allCourses.filter(course => course && course.instructorId === user?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl text-white p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.email || 'User'}!
        </h1>
        <p className="text-blue-100">
          {user?.role === 'INSTRUCTOR' 
            ? 'Manage your courses and create new learning experiences'
            : user?.role === 'ADMIN'
            ? 'Welcome to the admin dashboard'
            : 'Continue your learning journey with our courses'}
        </p>
      </div>

      {/* Instructor Section - My Courses */}
      {user?.role === 'INSTRUCTOR' && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
            <Link 
              to="/create-course" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              Create Course
            </Link>
          </div>
          
          {myCourses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">You haven't created any courses yet.</p>
              <Link to="/create-course" className="text-blue-600 hover:underline inline-block">
                Create your first course →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onDelete={handleCourseDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Admin Section - All Courses Management */}
      {user?.role === 'ADMIN' && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">All Courses (Admin)</h2>
            <Link 
              to="/create-course" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              Create Course
            </Link>
          </div>
          
          {allCourses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No courses available. Create your first course!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onDelete={handleCourseDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Student Section - Enrolled Courses */}
      {user?.role === 'STUDENT' && enrolledCourses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Enrolled Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(enrollment => (
              <CourseCard 
                key={enrollment.id} 
                course={enrollment.course} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Student Section - Available Courses (All Courses with Pagination) */}
      {user?.role === 'STUDENT' && (
        <div>
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Available Courses
              {pagination.totalElements > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({pagination.totalElements} courses)
                </span>
              )}
            </h2>
            <SortOptions onSort={handleSortChange} currentSort={sort} />
          </div>
          
          {allCourses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No courses available at the moment.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              
              {/* Pagination Controls */}
              <Pagination
                currentPage={pagination.currentPage + 1}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
              
              {/* Page Info */}
              <div className="text-center text-sm text-gray-500 mt-4">
                Showing {allCourses.length} of {pagination.totalElements} courses
              </div>
            </>
          )}
        </div>
      )}

      {/* Guest View (Not logged in) - with Pagination */}
      {!user && (
        <div>
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Available Courses
              {pagination.totalElements > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({pagination.totalElements} courses)
                </span>
              )}
            </h2>
            <SortOptions onSort={handleSortChange} currentSort={sort} />
          </div>
          
          {allCourses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No courses available at the moment.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              
              {/* Pagination Controls */}
              <Pagination
                currentPage={pagination.currentPage + 1}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
              
              {/* Page Info */}
              <div className="text-center text-sm text-gray-500 mt-4">
                Showing {allCourses.length} of {pagination.totalElements} courses
              </div>
              
              {pagination.totalElements > 9 && (
                <div className="text-center mt-8">
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Login to see all courses and enroll
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;