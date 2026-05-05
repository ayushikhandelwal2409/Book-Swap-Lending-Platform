package com.bookswap.bookswap.repository;

import com.bookswap.bookswap.model.BorrowRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long> {
    List<BorrowRequest> findByRequesterId(Long requesterId);
    List<BorrowRequest> findByBookOwnerId(Long ownerId);
}
