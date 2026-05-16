package com.example.e_learning.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class CreateLectureRequest {
    @NotBlank(message = "Lecture title is required")
    private String title;

    private String videoUrl;
    private Integer orderIndex;
}