package com.example.e_learning.dto;

import lombok.Data;
import lombok.Builder;
import java.time.LocalDateTime;

@Data
@Builder
public class UserProfileDTO {
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private LocalDateTime createdAt;
    private Long enrolledCoursesCount;
    private Long createdCoursesCount;
}