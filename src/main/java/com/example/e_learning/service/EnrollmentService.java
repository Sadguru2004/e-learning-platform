package com.example.e_learning.service;

import com.example.e_learning.dto.EnrollmentDTO;
import com.example.e_learning.model.Course;
import com.example.e_learning.model.Enrollment;
import com.example.e_learning.model.User;
import com.example.e_learning.repository.CourseRepository;
import com.example.e_learning.repository.EnrollmentRepository;
import com.example.e_learning.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             CourseRepository courseRepository,
                             UserRepository userRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    private EnrollmentDTO convertToDTO(Enrollment enrollment) {
        EnrollmentDTO dto = new EnrollmentDTO();
        dto.setId(enrollment.getId());
        dto.setStudentId(enrollment.getStudent().getId());
        dto.setStudentName(enrollment.getStudent().getFullName());
        dto.setCourseId(enrollment.getCourse().getId());
        dto.setCourseTitle(enrollment.getCourse().getTitle());
        dto.setEnrolledAt(enrollment.getEnrolledAt());
        return dto;
    }

    // Student enrolls in a course
    public EnrollmentDTO enrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Check if already enrolled
        if (enrollmentRepository.existsByStudentAndCourse(student, course)) {
            throw new RuntimeException("Already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrolledAt(LocalDateTime.now());

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return convertToDTO(savedEnrollment);
    }

    // Get all courses a student is enrolled in
    public List<EnrollmentDTO> getStudentEnrollments(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return enrollmentRepository.findByStudent(student).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get all students enrolled in a course (for instructor)
    public List<EnrollmentDTO> getCourseEnrollments(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return enrollmentRepository.findByCourse(course).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Check if student is enrolled
    public boolean isEnrolled(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return enrollmentRepository.existsByStudentAndCourse(student, course);
    }

    // Unenroll from course
    public void unenroll(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Enrollment enrollment = enrollmentRepository.findByStudentAndCourse(student, course)
                .orElseThrow(() -> new RuntimeException("Not enrolled in this course"));

        enrollmentRepository.delete(enrollment);
    }

    // Get enrollment count for a course
    public long getEnrollmentCount(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return enrollmentRepository.countByCourse(course);
    }
}