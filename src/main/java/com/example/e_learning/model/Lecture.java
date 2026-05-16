package com.example.e_learning.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lectures")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lecture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String videoUrl;   // could be YouTube link or stored video path

    private Integer orderIndex; // to sort lectures

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}
