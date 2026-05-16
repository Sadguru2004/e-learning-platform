package com.example.e_learning.repository;

import com.example.e_learning.model.Lecture;
import com.example.e_learning.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {
    List<Lecture> findByCourseOrderByOrderIndexAsc(Course course);
    void deleteByCourseId(Long courseId);
}