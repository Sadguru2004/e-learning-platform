package com.example.e_learning.service;

import com.example.e_learning.dto.UserProfileDTO;
import com.example.e_learning.dto.ProfileUpdateRequest;
import com.example.e_learning.dto.ChangePasswordRequest;
import com.example.e_learning.model.User;
import com.example.e_learning.repository.UserRepository;
import com.example.e_learning.repository.EnrollmentRepository;
import com.example.e_learning.repository.CourseRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       EnrollmentRepository enrollmentRepository,
                       CourseRepository courseRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long enrolledCoursesCount = enrollmentRepository.countByStudent(user);
        long createdCoursesCount = courseRepository.countByInstructor(user);

        return UserProfileDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .enrolledCoursesCount(enrolledCoursesCount)
                .createdCoursesCount(createdCoursesCount)
                .build();
    }

    public UserProfileDTO updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if email is already taken by another user
        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        User updatedUser = userRepository.save(user);

        return UserProfileDTO.builder()
                .id(updatedUser.getId())
                .email(updatedUser.getEmail())
                .fullName(updatedUser.getFullName())
                .role(updatedUser.getRole())
                .enrolledCoursesCount(0L)
                .createdCoursesCount(0L)
                .build();
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New passwords do not match");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}