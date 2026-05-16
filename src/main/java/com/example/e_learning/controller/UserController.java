package com.example.e_learning.controller;

import com.example.e_learning.dto.ProfileUpdateRequest;
import com.example.e_learning.dto.ChangePasswordRequest;
import com.example.e_learning.dto.UserProfileDTO;
import com.example.e_learning.model.User;
import com.example.e_learning.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get current user profile
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.getUserProfile(currentUser.getId()));
    }

    // Update user profile
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(currentUser.getId(), request));
    }

    // Change password
    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(currentUser.getId(), request);
        return ResponseEntity.ok().build();
    }

    // Delete account
    @DeleteMapping("/account")
    public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal User currentUser) {
        userService.deleteAccount(currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}