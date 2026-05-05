package com.bookswap.bookswap.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "rater_id")
    private User rater;

    @ManyToOne
    @JoinColumn(name = "ratee_id")
    private User ratee;

    private int score; // 1 to 5
    private String comment;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
