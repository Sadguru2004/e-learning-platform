package com.example.e_learning.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class UserDTO {
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private Long enrolledCoursesCount;
    private Long createdCoursesCount;
}