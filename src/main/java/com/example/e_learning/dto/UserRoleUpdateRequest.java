package com.example.e_learning.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class UserRoleUpdateRequest {
    @NotBlank(message = "Role is required")
    private String role;
}