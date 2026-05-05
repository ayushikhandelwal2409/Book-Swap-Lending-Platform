package com.bookswap.controller;

import com.bookswap.model.Request;
import com.bookswap.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requests")
@CrossOrigin
public class RequestController {

    @Autowired
    private RequestService requestService;

    // send request
    @PostMapping
    public Request send(@RequestParam Long bookId,
                        @RequestParam Long userId){
        return requestService.sendRequest(bookId, userId);
    }

    // approve request
    @PutMapping("/approve/{id}")
    public Request approve(@PathVariable Long id){
        return requestService.approveRequest(id);
    }

    // get user requests
    @GetMapping("/user/{userId}")
    public List<Request> getUserRequests(@PathVariable Long userId){
        return requestService.getUserRequests(userId);
    }
}