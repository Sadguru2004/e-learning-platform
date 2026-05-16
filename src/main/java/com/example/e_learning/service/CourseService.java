package com.example.e_learning.service;

import com.example.e_learning.dto.CourseDTO;
import com.example.e_learning.dto.CreateCourseRequest;
import com.example.e_learning.model.Course;
import com.example.e_learning.model.User;
import com.example.e_learning.repository.CourseRepository;
import com.example.e_learning.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public CourseService(CourseRepository courseRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    // Convert Course entity to DTO
    private CourseDTO convertToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setThumbnailUrl(course.getThumbnailUrl());
        dto.setInstructorName(course.getInstructor().getFullName());
        dto.setInstructorId(course.getInstructor().getId());
        dto.setTotalLectures(course.getLectures() != null ? course.getLectures().size() : 0);
        return dto;
    }

    // Create a new course (only instructors can do this)
    public CourseDTO createCourse(CreateCourseRequest request, Long instructorId) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        // Verify user is an instructor
        if (!"INSTRUCTOR".equals(instructor.getRole()) && !"ADMIN".equals(instructor.getRole())) {
            throw new AccessDeniedException("Only instructors can create courses");
        }

        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setThumbnailUrl(request.getThumbnailUrl());
        course.setInstructor(instructor);

        Course savedCourse = courseRepository.save(course);
        return convertToDTO(savedCourse);
    }

    // Get all courses
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get course by ID
    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        return convertToDTO(course);
    }

    // Get courses by instructor
    public List<CourseDTO> getCoursesByInstructor(Long instructorId) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));
        return courseRepository.findByInstructor(instructor).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Update course (only instructor who created it or admin)
    public CourseDTO updateCourse(Long courseId, CreateCourseRequest request, Long userId, String userRole) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check if user is the instructor who created it or an admin
        if (!course.getInstructor().getId().equals(userId) && !"ADMIN".equals(userRole)) {
            throw new AccessDeniedException("You can only update your own courses");
        }

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setThumbnailUrl(request.getThumbnailUrl());

        Course updatedCourse = courseRepository.save(course);
        return convertToDTO(updatedCourse);
    }

    // Delete course (only instructor who created it or admin)
    public void deleteCourse(Long courseId, Long userId, String userRole) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check if user is the instructor who created it or an admin
        if (!course.getInstructor().getId().equals(userId) && !"ADMIN".equals(userRole)) {
            throw new AccessDeniedException("You can only delete your own courses");
        }

        courseRepository.delete(course);
    }

    // Search courses by title (case insensitive)
    public List<CourseDTO> searchCourses(String title) {
        return courseRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get courses by instructor name
    public List<CourseDTO> getCoursesByInstructorName(String instructorName) {
        return courseRepository.findByInstructorFullNameContainingIgnoreCase(instructorName).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get all courses with pagination
    public Page<CourseDTO> getAllCoursesPaginated(Pageable pageable) {
        return courseRepository.findAll(pageable).map(this::convertToDTO);
    }

    // Search courses with pagination
    public Page<CourseDTO> searchCoursesPaginated(String title, Pageable pageable) {
        return courseRepository.findByTitleContainingIgnoreCase(title, pageable).map(this::convertToDTO);
    }
}