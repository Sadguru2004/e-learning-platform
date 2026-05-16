package com.example.e_learning.service;

import com.example.e_learning.dto.LectureDTO;
import com.example.e_learning.dto.CreateLectureRequest;
import com.example.e_learning.model.Course;
import com.example.e_learning.model.Lecture;
import com.example.e_learning.model.User;
import com.example.e_learning.repository.CourseRepository;
import com.example.e_learning.repository.LectureRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LectureService {

    private final LectureRepository lectureRepository;
    private final CourseRepository courseRepository;

    public LectureService(LectureRepository lectureRepository, CourseRepository courseRepository) {
        this.lectureRepository = lectureRepository;
        this.courseRepository = courseRepository;
    }

    private LectureDTO convertToDTO(Lecture lecture) {
        LectureDTO dto = new LectureDTO();
        dto.setId(lecture.getId());
        dto.setTitle(lecture.getTitle());
        dto.setVideoUrl(lecture.getVideoUrl());
        dto.setOrderIndex(lecture.getOrderIndex());
        dto.setCourseId(lecture.getCourse().getId());
        dto.setCourseTitle(lecture.getCourse().getTitle());
        return dto;
    }

    // Add lecture to course (only course instructor or admin)
    public LectureDTO addLecture(Long courseId, CreateLectureRequest request, User currentUser) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check if user is instructor of this course or admin
        if (!course.getInstructor().getId().equals(currentUser.getId()) && !"ADMIN".equals(currentUser.getRole())) {
            throw new AccessDeniedException("You can only add lectures to your own courses");
        }

        Lecture lecture = new Lecture();
        lecture.setTitle(request.getTitle());
        lecture.setVideoUrl(request.getVideoUrl());
        lecture.setOrderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0);
        lecture.setCourse(course);

        Lecture savedLecture = lectureRepository.save(lecture);
        return convertToDTO(savedLecture);
    }

    // Get all lectures for a course
    public List<LectureDTO> getLecturesByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return lectureRepository.findByCourseOrderByOrderIndexAsc(course).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get single lecture
    public LectureDTO getLectureById(Long lectureId) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new RuntimeException("Lecture not found"));
        return convertToDTO(lecture);
    }

    // Update lecture (only course instructor)
    public LectureDTO updateLecture(Long lectureId, CreateLectureRequest request, User currentUser) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new RuntimeException("Lecture not found"));

        Course course = lecture.getCourse();
        if (!course.getInstructor().getId().equals(currentUser.getId()) && !"ADMIN".equals(currentUser.getRole())) {
            throw new AccessDeniedException("You can only update lectures in your own courses");
        }

        lecture.setTitle(request.getTitle());
        lecture.setVideoUrl(request.getVideoUrl());
        lecture.setOrderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : lecture.getOrderIndex());

        Lecture updatedLecture = lectureRepository.save(lecture);
        return convertToDTO(updatedLecture);
    }

    // Delete lecture (only course instructor)
    public void deleteLecture(Long lectureId, User currentUser) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new RuntimeException("Lecture not found"));

        Course course = lecture.getCourse();
        if (!course.getInstructor().getId().equals(currentUser.getId()) && !"ADMIN".equals(currentUser.getRole())) {
            throw new AccessDeniedException("You can only delete lectures from your own courses");
        }

        lectureRepository.delete(lecture);
    }
}