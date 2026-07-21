package com.jankalyan.category.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(length = 100, unique = true, nullable = false)
    private String name;

    @Column(length = 100, nullable = false)
    private String department;

    @Column(columnDefinition = "TEXT")
    private String description;
}
