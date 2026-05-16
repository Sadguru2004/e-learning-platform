import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { deleteCourse } from '../../services/courseService';
import toast from 'react-hot-toast';

const CourseCard = ({ course, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Guard clause - if course is undefined or null, show nothing
  if (!course || typeof course !== 'object') {
    console.warn('CourseCard received invalid course prop:', course);
    return null;
  }

  // Safely access properties with fallbacks
  const courseId = course.id;
  const courseTitle = course.title || 'Untitled Course';
  const courseDescription = course.description || 'No description available';
  const courseThumbnail = course.thumbnailUrl || null;
  const instructorName = course.instructorName || 'Unknown Instructor';
  const totalLectures = course.totalLectures || 0;
  const instructorId = course.instructorId;

  // Check if current user can delete this course
  const isOwner = user?.id === instructorId;
  const isAdmin = user?.role === 'ADMIN';
  const canDelete = (isOwner || isAdmin) && user?.role !== 'STUDENT';

  const handleCardClick = (e) => {
    if (e.target.closest('.delete-btn')) return;
    if (courseId) {
      navigate(`/courses/${courseId}`);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!courseId) return;
    if (!confirm(`Delete "${courseTitle}"? This cannot be undone.`)) return;
    
    setDeleting(true);
    try {
      await deleteCourse(courseId);
      toast.success('Course deleted successfully');
      if (onDelete && typeof onDelete === 'function') {
        onDelete(courseId);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data || 'Failed to delete course');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div 
      className="card cursor-pointer relative group hover:shadow-xl transition-all duration-300 bg-white rounded-xl overflow-hidden" 
      onClick={handleCardClick}
    >
      {/* Delete Button - Only visible to instructors/admins on hover */}
      {canDelete && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="delete-btn absolute top-2 right-2 z-10 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all shadow-lg opacity-0 group-hover:opacity-100 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
      
      {/* Course Image */}
      <div className="h-40 bg-gradient-to-r from-blue-400 to-blue-600 overflow-hidden">
        {courseThumbnail && !imageError ? (
          <img 
            src={courseThumbnail} 
            alt={courseTitle}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <BookOpen className="h-10 w-10 mb-1 opacity-70" />
            <span className="text-xs opacity-70">No Image</span>
          </div>
        )}
      </div>
      
      {/* Course Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-gray-800 line-clamp-1">
          {courseTitle}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-2">
          {courseDescription}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span className="truncate max-w-[140px]" title={instructorName}>
            👨‍🏫 {instructorName}
          </span>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{totalLectures} lectures</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;