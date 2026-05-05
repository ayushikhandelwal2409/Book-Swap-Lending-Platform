package com.bookswap.bookswap.controller;

import com.bookswap.bookswap.model.Rating;
import com.bookswap.bookswap.model.User;
import com.bookswap.bookswap.repository.RatingRepository;
import com.bookswap.bookswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{raterId}/rate/{rateeId}")
    public Rating rateUser(@PathVariable Long raterId, @PathVariable Long rateeId, @RequestBody Rating rating) {
        User rater = userRepository.findById(raterId).orElseThrow();
        User ratee = userRepository.findById(rateeId).orElseThrow();
        
        rating.setRater(rater);
        rating.setRatee(ratee);
        Rating savedRating = ratingRepository.save(rating);

        // Update average rating for ratee
        List<Rating> allRatings = ratingRepository.findByRateeId(rateeId);
        double avg = allRatings.stream().mapToInt(Rating::getScore).average().orElse(0.0);
        ratee.setAverageRating(Math.round(avg * 10.0) / 10.0);
        userRepository.save(ratee);

        return savedRating;
    }

    @GetMapping("/user/{userId}")
    public List<Rating> getUserRatings(@PathVariable Long userId) {
        return ratingRepository.findByRateeId(userId);
    }
}
