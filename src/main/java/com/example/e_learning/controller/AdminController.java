package com.example.e_learning.controller;

import com.example.e_learning.dto.UserDTO;
import com.example.e_learning.dto.UserRoleUpdateRequest;
import com.example.e_learning.dto.AdminStatsDTO;
import com.example.e_learning.model.User;
import com.example.e_learning.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Helper method to check if user is admin
    private void checkAdminRole(User user) {
        if (user == null || !"ADMIN".equals(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }
    }

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers(@AuthenticationPrincipal User currentUser) {
        checkAdminRole(currentUser);
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // Get user by ID
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserById(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id) {
        checkAdminRole(currentUser);
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    // Update user role
    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id,
            @RequestBody UserRoleUpdateRequest request) {
        checkAdminRole(currentUser);
        return ResponseEntity.ok(adminService.updateUserRole(id, request));
    }

    // Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id) {
        checkAdminRole(currentUser);
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Get dashboard statistics
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getDashboardStats(@AuthenticationPrincipal User currentUser) {
        checkAdminRole(currentUser);
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
}