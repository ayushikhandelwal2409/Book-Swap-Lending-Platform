package com.bookswap.bookswap.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private String genre;
    private String condition;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    private String status = "AVAILABLE"; // AVAILABLE, BORROWED
}