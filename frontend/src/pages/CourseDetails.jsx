import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getCourseById, deleteCourse } from '../services/courseService';
import { getCourseLectures } from '../services/lectureService';
import { enrollInCourse, checkEnrollment, unenroll } from '../services/enrollmentService';
import api from '../api/axios';
import { BookOpen, Users, Trash2, Plus, ArrowLeft, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Add Lecture Modal Component
const AddLectureModal = ({ isOpen, onClose, courseId, onLectureAdded }) => {
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/courses/${courseId}/lectures`, { title, videoUrl, orderIndex: 0 });
      toast.success('Lecture added successfully!');
      onLectureAdded();
      onClose();
      setTitle('');
      setVideoUrl('');
    } catch (err) {
      toast.error(err.response?.data || 'Failed to add lecture');
      console.error('Error adding lecture:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Add New Lecture</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Lecture Title *</label>
            <input
              type="text"
              placeholder="e.g., Introduction to Spring Boot"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">YouTube Video URL</label>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Paste any YouTube video link</p>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex-1">
              {loading ? 'Adding...' : 'Add Lecture'}
            </button>
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Lecture List Component
const LectureList = ({ lectures, isEnrolled }) => {
  const [selectedLecture, setSelectedLecture] = useState(lectures?.[0]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  const videoUrl = selectedLecture?.videoUrl ? getYouTubeEmbedUrl(selectedLecture.videoUrl) : null;

  if (!lectures || lectures.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">No lectures yet. Click "Add Lecture" to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-black rounded-lg overflow-hidden aspect-video">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              className="w-full h-full"
              title={selectedLecture?.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-800 text-white">
              {selectedLecture ? 'No video available for this lecture' : 'Click on a lecture to watch'}
            </div>
          )}
        </div>
        {selectedLecture && (
          <div className="mt-4">
            <h3 className="text-xl font-bold">{selectedLecture.title}</h3>
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b font-semibold">Course Content ({lectures.length} lectures)</div>
        <div className="divide-y max-h-[500px] overflow-y-auto">
          {lectures.map((lecture, idx) => (
            <button
              key={lecture.id}
              onClick={() => isEnrolled && setSelectedLecture(lecture)}
              disabled={!isEnrolled}
              className={`w-full text-left p-3 hover:bg-gray-50 transition ${
                !isEnrolled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              } ${selectedLecture?.id === lecture.id ? 'bg-blue-50' : ''}`}
            >
              <p className="font-medium">{lecture.title}</p>
              <p className="text-xs text-gray-500">Lecture {idx + 1}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddLecture, setShowAddLecture] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Debug logging
  console.log('Current user:', user);
  console.log('User role:', user?.role);
  console.log('Is user INSTRUCTOR?', user?.role === 'INSTRUCTOR');

  const isInstructor = user?.role === 'INSTRUCTOR';
  const isAdmin = user?.role === 'ADMIN';
  const canManage = isInstructor || isAdmin;

  console.log('Can manage (show buttons):', canManage);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const courseData = await getCourseById(id);
      const lecturesData = await getCourseLectures(id);
      setCourse(courseData);
      setLectures(lecturesData);
      
      console.log('Course instructor ID:', courseData?.instructorId);
      console.log('Current user ID:', user?.id);
      console.log('Is owner:', courseData?.instructorId === user?.id);
      
      if (user?.role === 'STUDENT') {
        const enrolled = await checkEnrollment(id);
        setIsEnrolled(enrolled);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load course');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollInCourse(id);
      setIsEnrolled(true);
      toast.success('Successfully enrolled!');
    } catch (error) {
      toast.error(error.response?.data || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    if (!confirm('Are you sure you want to unenroll from this course?')) return;
    setEnrolling(true);
    try {
      await unenroll(id);
      setIsEnrolled(false);
      toast.success('Unenrolled from course');
    } catch (error) {
      toast.error('Failed to unenroll');
    } finally {
      setEnrolling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this course? This action cannot be undone.')) return;
    try {
      await deleteCourse(id);
      toast.success('Course deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!course) return <div className="text-center py-10">Course not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
        <ArrowLeft className="h-5 w-5" /> Back
      </button>

      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
          {course.thumbnailUrl ? (
            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <BookOpen className="h-16 w-16 text-white opacity-50" />
          )}
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-2">by {course.instructorName}</p>
              <p className="text-gray-700">{course.description}</p>
              <p className="text-sm text-gray-500 mt-2">{lectures.length} lecture{lectures.length !== 1 ? 's' : ''}</p>
            </div>
            
            {/* ACTION BUTTONS - Visible to Instructors and Admins only */}
            {canManage && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddLecture(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Lecture
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" /> Delete Course
                </button>
              </div>
            )}
          </div>

          {/* Show message if user is logged in as student but not instructor */}
          {user && user?.role !== 'INSTRUCTOR' && user?.role !== 'ADMIN' && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
              You are viewing as a student. To add lectures, please login as an instructor.
            </div>
          )}

          {/* Enrollment for Students */}
          {user?.role === 'STUDENT' && (
            <div className="mt-4">
              {!isEnrolled ? (
                <button onClick={handleEnroll} disabled={enrolling} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              ) : (
                <button onClick={handleUnenroll} disabled={enrolling} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                  {enrolling ? 'Processing...' : 'Unenroll'}
                </button>
              )}
            </div>
          )}

          {/* Info Messages */}
          {canManage && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              👨‍🏫 As instructor, you can add lectures and delete this course.
            </div>
          )}
          {user?.role === 'STUDENT' && !isEnrolled && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
              🔒 Enroll to access all lectures.
            </div>
          )}
        </div>
      </div>

      {/* Lectures Section */}
      {(isEnrolled || canManage) ? (
        <LectureList lectures={lectures} isEnrolled={isEnrolled || canManage} />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Enroll to view course content.</p>
          {user?.role === 'STUDENT' && (
            <button onClick={handleEnroll} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
              Enroll Now
            </button>
          )}
        </div>
      )}

      {/* Add Lecture Modal */}
      <AddLectureModal
        isOpen={showAddLecture}
        onClose={() => setShowAddLecture(false)}
        courseId={course.id}
        onLectureAdded={fetchData}
      />
    </div>
  );
};

export default CourseDetails;