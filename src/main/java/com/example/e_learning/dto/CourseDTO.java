package com.example.e_learning.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String instructorName;
    private Long instructorId;
    private Integer totalLectures;
}