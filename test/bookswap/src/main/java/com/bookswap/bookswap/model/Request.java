package com.bookswap.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester;

    private String status; // PENDING / APPROVED / REJECTED
}