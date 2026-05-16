import React, { useState } from 'react';
import { Play, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LectureList = ({ lectures, isEnrolled, courseId, onRefresh }) => {
  const [selectedLecture, setSelectedLecture] = useState(lectures?.[0]);
  const { user } = useAuth();
  const isInstructor = user?.role === 'INSTRUCTOR';

  if (!lectures || lectures.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">No lectures available</p>
      </div>
    );
  }

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

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Video Player */}
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
            <div className="flex items-center justify-center h-full bg-gray-800">
              <div className="text-center text-gray-400">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No video available for this lecture</p>
              </div>
            </div>
          )}
        </div>
        
        {selectedLecture && (
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">{selectedLecture.title}</h3>
          </div>
        )}
      </div>

      {/* Lecture List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">Course Content</h3>
          <p className="text-sm text-gray-500">{lectures.length} lectures</p>
        </div>
        <div className="divide-y max-h-[500px] overflow-y-auto">
          {lectures.map((lecture, index) => (
            <button
              key={lecture.id}
              onClick={() => isEnrolled && setSelectedLecture(lecture)}
              className={`w-full text-left p-4 hover:bg-gray-50 transition flex items-start gap-3 ${
                !isEnrolled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              } ${selectedLecture?.id === lecture.id ? 'bg-blue-50' : ''}`}
              disabled={!isEnrolled}
            >
              {isEnrolled ? (
                <Play className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0" />
              ) : (
                <Lock className="h-5 w-5 mt-0.5 text-gray-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`text-sm ${selectedLecture?.id === lecture.id ? 'font-semibold text-blue-600' : 'text-gray-800'}`}>
                  {lecture.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Lecture {index + 1}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LectureList;