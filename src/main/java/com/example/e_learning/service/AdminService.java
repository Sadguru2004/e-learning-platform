package com.example.e_learning.service;

import com.example.e_learning.dto.UserDTO;
import com.example.e_learning.dto.UserRoleUpdateRequest;
import com.example.e_learning.dto.AdminStatsDTO;
import com.example.e_learning.model.User;
import com.example.e_learning.repository.UserRepository;
import com.example.e_learning.repository.CourseRepository;
import com.example.e_learning.repository.EnrollmentRepository;
import com.example.e_learning.repository.LectureRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LectureRepository lectureRepository;

    public AdminService(UserRepository userRepository,
                        CourseRepository courseRepository,
                        EnrollmentRepository enrollmentRepository,
                        LectureRepository lectureRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lectureRepository = lectureRepository;
    }

    private UserDTO convertToDTO(User user) {
        long enrolledCount = enrollmentRepository.countByStudent(user);
        long createdCount = courseRepository.countByInstructor(user);

        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .enrolledCoursesCount(enrolledCount)
                .createdCoursesCount(createdCount)
                .build();
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }

    @Transactional
    public UserDTO updateUserRole(Long id, UserRoleUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(request.getRole());
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    public AdminStatsDTO getDashboardStats() {
        List<User> allUsers = userRepository.findAll();

        long totalStudents = allUsers.stream().filter(u -> "STUDENT".equals(u.getRole())).count();
        long totalInstructors = allUsers.stream().filter(u -> "INSTRUCTOR".equals(u.getRole())).count();
        long totalAdmins = allUsers.stream().filter(u -> "ADMIN".equals(u.getRole())).count();
        long totalCourses = courseRepository.count();
        long totalEnrollments = enrollmentRepository.count();
        long totalLectures = lectureRepository.count();

        return AdminStatsDTO.builder()
                .totalUsers(allUsers.size())
                .totalStudents(totalStudents)
                .totalInstructors(totalInstructors)
                .totalAdmins(totalAdmins)
                .totalCourses(totalCourses)
                .totalEnrollments(totalEnrollments)
                .totalLectures(totalLectures)
                .build();
    }
}