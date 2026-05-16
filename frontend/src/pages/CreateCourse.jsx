import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse } from '../services/courseService';
import toast from 'react-hot-toast';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newCourse = await createCourse(formData);
      toast.success('Course created successfully!');
      
      // Redirect to dashboard or my-courses page
      // Option 1: Go to dashboard
      navigate('/dashboard');
      
      // Option 2: Go to the course details page
      // navigate(`/courses/${newCourse.id}`);
      
      // Option 3: Go to my courses page (uncomment if you have this page)
      // navigate('/my-courses');
      
    } catch (error) {
      toast.error(error.response?.data || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Course</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Complete Java Spring Boot Course"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              placeholder="What will students learn in this course?"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Thumbnail URL (optional)
            </label>
            <input
              type="url"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Add an image URL for your course cover
            </p>
            {formData.thumbnailUrl && (
              <div className="mt-2">
                <img 
                  src={formData.thumbnailUrl} 
                  alt="Preview" 
                  className="h-32 w-48 object-cover rounded border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    toast.error('Invalid image URL');
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;