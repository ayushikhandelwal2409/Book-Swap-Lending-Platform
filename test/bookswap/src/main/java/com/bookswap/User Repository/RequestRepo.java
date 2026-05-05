package com.bookswap.repository;

import com.bookswap.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestRepo extends JpaRepository<Request, Long> {

    List<Request> findByRequesterId(Long userId);
}