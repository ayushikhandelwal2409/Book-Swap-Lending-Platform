package com.bookswap.bookswap.controller;

import com.bookswap.bookswap.model.Book;
import com.bookswap.bookswap.model.BorrowRequest;
import com.bookswap.bookswap.model.User;
import com.bookswap.bookswap.repository.BookRepository;
import com.bookswap.bookswap.repository.BorrowRequestRepository;
import com.bookswap.bookswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class BorrowRequestController {

    @Autowired
    private BorrowRequestRepository requestRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{bookId}/request/{userId}")
    public BorrowRequest createRequest(@PathVariable Long bookId, @PathVariable Long userId) {
        Book book = bookRepository.findById(bookId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

        BorrowRequest request = new BorrowRequest();
        request.setBook(book);
        request.setRequester(user);
        request.setStatus("PENDING");
        return requestRepository.save(request);
    }

    @GetMapping("/owner/{ownerId}")
    public List<BorrowRequest> getRequestsForOwner(@PathVariable Long ownerId) {
        return requestRepository.findByBookOwnerId(ownerId);
    }
    
    @PutMapping("/{requestId}/approve")
    public BorrowRequest approveRequest(@PathVariable Long requestId) {
        BorrowRequest request = requestRepository.findById(requestId).orElseThrow();
        request.setStatus("APPROVED");
        Book book = request.getBook();
        book.setStatus("BORROWED");
        bookRepository.save(book);
        return requestRepository.save(request);
    }
}
