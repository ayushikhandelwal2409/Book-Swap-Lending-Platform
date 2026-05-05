package com.bookswap.service;

public package com.bookswap.service;

import com.bookswap.model.Book;
import com.bookswap.model.Request;
import com.bookswap.model.User;
import com.bookswap.repository.BookRepo;
import com.bookswap.repository.RequestRepo;
import com.bookswap.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestService {

    @Autowired
    private RequestRepo requestRepo;

    @Autowired
    private BookRepo bookRepo;

    @Autowired
    private UserRepo userRepo;

    // 🔥 SEND REQUEST
    public Request sendRequest(Long bookId, Long userId) {

        Book book = bookRepo.findById(bookId).get();
        User user = userRepo.findById(userId).get();

        Request req = new Request();
        req.setBook(book);
        req.setRequester(user);
        req.setStatus("PENDING");

        return requestRepo.save(req);
    }

    // 🔥 APPROVE REQUEST
    public Request approveRequest(Long requestId) {

        Request req = requestRepo.findById(requestId).get();
        req.setStatus("APPROVED");

        Book book = req.getBook();
        book.setStatus("LENT");

        bookRepo.save(book);
        return requestRepo.save(req);
    }

    // 🔥 GET USER REQUESTS
    public List<Request> getUserRequests(Long userId) {
        return requestRepo.findByRequesterId(userId);
    }
} {
    
}
