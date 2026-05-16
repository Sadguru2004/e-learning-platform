package com.example.e_learning.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private String role;  // STUDENT or INSTRUCTOR
}
