package com.example.e_learning.controller;

import com.example.e_learning.dto.EnrollmentDTO;
import com.example.e_learning.model.User;
import com.example.e_learning.service.EnrollmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    // Enroll in a course (Student only)
    @PostMapping("/courses/{courseId}")
    public ResponseEntity<EnrollmentDTO> enroll(
            @PathVariable Long courseId,
            @AuthenticationPrincipal User currentUser) {
        if (!"STUDENT".equals(currentUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        EnrollmentDTO enrollment = enrollmentService.enrollStudent(courseId, currentUser.getId());
        return new ResponseEntity<>(enrollment, HttpStatus.CREATED);
    }

    // Get my enrolled courses (Student)
    @GetMapping("/my-courses")
    public ResponseEntity<List<EnrollmentDTO>> getMyEnrolledCourses(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(enrollmentService.getStudentEnrollments(currentUser.getId()));
    }

    // Check if I'm enrolled in a course
    @GetMapping("/check/{courseId}")
    public ResponseEntity<Boolean> checkEnrollment(
            @PathVariable Long courseId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(enrollmentService.isEnrolled(courseId, currentUser.getId()));
    }

    // Get all students in a course (Instructor only)
    @GetMapping("/courses/{courseId}/students")
    public ResponseEntity<List<EnrollmentDTO>> getCourseStudents(
            @PathVariable Long courseId,
            @AuthenticationPrincipal User currentUser) {
        // Verify instructor owns this course (you can add this check)
        return ResponseEntity.ok(enrollmentService.getCourseEnrollments(courseId));
    }

    // Unenroll from course
    @DeleteMapping("/courses/{courseId}")
    public ResponseEntity<Void> unenroll(
            @PathVariable Long courseId,
            @AuthenticationPrincipal User currentUser) {
        enrollmentService.unenroll(courseId, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    // Get enrollment count for a course
    @GetMapping("/courses/{courseId}/count")
    public ResponseEntity<Long> getEnrollmentCount(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentCount(courseId));
    }
}