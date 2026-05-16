package com.example.e_learning.controller;

import com.example.e_learning.dto.LectureDTO;
import com.example.e_learning.dto.CreateLectureRequest;
import com.example.e_learning.model.User;
import com.example.e_learning.service.LectureService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses/{courseId}/lectures")
public class LectureController {

    private final LectureService lectureService;

    public LectureController(LectureService lectureService) {
        this.lectureService = lectureService;
    }

    // Add lecture to course (Instructor only)
    @PostMapping
    public ResponseEntity<LectureDTO> addLecture(
            @PathVariable Long courseId,
            @Valid @RequestBody CreateLectureRequest request,
            @AuthenticationPrincipal User currentUser) {
        LectureDTO lecture = lectureService.addLecture(courseId, request, currentUser);
        return new ResponseEntity<>(lecture, HttpStatus.CREATED);
    }

    // Get all lectures for a course (Anyone)
    @GetMapping
    public ResponseEntity<List<LectureDTO>> getCourseLectures(@PathVariable Long courseId) {
        return ResponseEntity.ok(lectureService.getLecturesByCourse(courseId));
    }

    // Get single lecture by ID
    @GetMapping("/{lectureId}")
    public ResponseEntity<LectureDTO> getLectureById(@PathVariable Long lectureId) {
        return ResponseEntity.ok(lectureService.getLectureById(lectureId));
    }

    // Update lecture (Instructor only)
    @PutMapping("/{lectureId}")
    public ResponseEntity<LectureDTO> updateLecture(
            @PathVariable Long lectureId,
            @Valid @RequestBody CreateLectureRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(lectureService.updateLecture(lectureId, request, currentUser));
    }

    // Delete lecture (Instructor only)
    @DeleteMapping("/{lectureId}")
    public ResponseEntity<Void> deleteLecture(
            @PathVariable Long lectureId,
            @AuthenticationPrincipal User currentUser) {
        lectureService.deleteLecture(lectureId, currentUser);
        return ResponseEntity.noContent().build();
    }
}