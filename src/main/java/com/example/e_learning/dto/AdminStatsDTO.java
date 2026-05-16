package com.example.e_learning.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class AdminStatsDTO {
    private long totalUsers;
    private long totalStudents;
    private long totalInstructors;
    private long totalAdmins;
    private long totalCourses;
    private long totalEnrollments;
    private long totalLectures;
}