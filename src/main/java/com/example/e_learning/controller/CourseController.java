package com.example.e_learning.controller;

import com.example.e_learning.dto.CourseDTO;
import com.example.e_learning.dto.CreateCourseRequest;
import com.example.e_learning.model.User;
import com.example.e_learning.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // Create a new course (INSTRUCTOR only)
    @PostMapping
    public ResponseEntity<CourseDTO> createCourse(
            @Valid @RequestBody CreateCourseRequest request,
            @AuthenticationPrincipal User currentUser) {
        CourseDTO course = courseService.createCourse(request, currentUser.getId());
        return new ResponseEntity<>(course, HttpStatus.CREATED);
    }

    // Get all courses (everyone)
    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    // Get single course by ID
    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    // Get courses by instructor
    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<List<CourseDTO>> getCoursesByInstructor(@PathVariable Long instructorId) {
        return ResponseEntity.ok(courseService.getCoursesByInstructor(instructorId));
    }

    // Get my courses (current user's courses if they are instructor)
    @GetMapping("/my-courses")
    public ResponseEntity<List<CourseDTO>> getMyCourses(@AuthenticationPrincipal User currentUser) {
        if ("INSTRUCTOR".equals(currentUser.getRole()) || "ADMIN".equals(currentUser.getRole())) {
            return ResponseEntity.ok(courseService.getCoursesByInstructor(currentUser.getId()));
        }
        return ResponseEntity.ok(List.of()); // Students don't create courses
    }

    // Update course (INSTRUCTOR who created it or ADMIN)
    @PutMapping("/{id}")
    public ResponseEntity<CourseDTO> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CreateCourseRequest request,
            @AuthenticationPrincipal User currentUser) {
        CourseDTO updatedCourse = courseService.updateCourse(id, request, currentUser.getId(), currentUser.getRole());
        return ResponseEntity.ok(updatedCourse);
    }

    // Delete course (INSTRUCTOR who created it or ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        courseService.deleteCourse(id, currentUser.getId(), currentUser.getRole());
        return ResponseEntity.noContent().build();
    }

    // Search courses by title
    @GetMapping("/search")
    public ResponseEntity<List<CourseDTO>> searchCourses(@RequestParam String title) {
        return ResponseEntity.ok(courseService.searchCourses(title));
    }

    // Get courses by instructor name
    @GetMapping("/instructor/{name}")
    public ResponseEntity<List<CourseDTO>> getCoursesByInstructorName(@PathVariable String name) {
        return ResponseEntity.ok(courseService.getCoursesByInstructorName(name));
    }

    // Get all courses with pagination
    @GetMapping("/paginated")
    public ResponseEntity<Page<CourseDTO>> getAllCoursesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        return ResponseEntity.ok(courseService.getAllCoursesPaginated(pageable));
    }

    // Search courses with pagination
    @GetMapping("/search/paginated")
    public ResponseEntity<Page<CourseDTO>> searchCoursesPaginated(
            @RequestParam String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(courseService.searchCoursesPaginated(title, pageable));
    }
}