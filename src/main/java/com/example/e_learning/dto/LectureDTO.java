package com.example.e_learning.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LectureDTO {
    private Long id;
    private String title;
    private String videoUrl;
    private Integer orderIndex;
    private Long courseId;
    private String courseTitle;
}