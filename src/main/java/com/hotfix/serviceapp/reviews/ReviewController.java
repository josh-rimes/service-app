package com.hotfix.serviceapp.reviews;

import com.hotfix.serviceapp.users.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public Review createReview(@RequestBody CreateReviewRequestDto request) {

        User customer = (User) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();

        return reviewService.createReview(request, customer);
    }

    @GetMapping("/tradesman/{id}")
    public List<Review> getTradesmanReviews(@PathVariable Integer id) {
        return reviewService.getReviewsForTradesman(id);
    }
}
