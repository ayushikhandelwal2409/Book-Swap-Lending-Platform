package com.bookswap.bookswap.controller;

import com.bookswap.bookswap.model.User;
import com.bookswap.bookswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public User loginUser(@RequestBody User user) {
        return userRepository.findByEmail(user.getEmail())
            .filter(u -> u.getPassword().equals(user.getPassword()))
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
