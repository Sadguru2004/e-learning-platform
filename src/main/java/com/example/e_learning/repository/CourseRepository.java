package com.example.e_learning.repository;

import com.example.e_learning.model.Course;
import com.example.e_learning.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    // Find all courses by instructor
    List<Course> findByInstructor(User instructor);

    // Search courses by title (case insensitive)
    List<Course> findByTitleContainingIgnoreCase(String title);

    // Search by instructor name (case insensitive)
    @Query("SELECT c FROM Course c WHERE LOWER(c.instructor.fullName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Course> findByInstructorFullNameContainingIgnoreCase(@Param("name") String name);

    Page<Course> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    long countByInstructor(User instructor);
}