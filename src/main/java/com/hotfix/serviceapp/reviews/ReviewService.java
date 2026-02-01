package com.hotfix.serviceapp.reviews;

import com.hotfix.serviceapp.jobs.Job;
import com.hotfix.serviceapp.jobs.JobRepository;
import com.hotfix.serviceapp.users.User;
import com.hotfix.serviceapp.users.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.hotfix.serviceapp.jobs.JobStatus.COMPLETED;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, JobRepository jobRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public Review createReview(CreateReviewRequestDto request, User customer) {

        Job job = jobRepository.findById(request.jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("Not your job");
        }

        if(!COMPLETED.equals(job.getStatus())) {
            throw new RuntimeException("Job not completed");
        }

        if (reviewRepository.existsByJobId(job.getId())) {
            throw new RuntimeException("Job already reviewed");
        }

        Review review = new Review();
        review.setJob(job);
        review.setCustomer(customer);
        review.setTradesman(job.getSelectedTradesman());
        review.setRating(request.rating);
        review.setComment(request.comment);

        Review saved = reviewRepository.save(review);

        updateTradesmanRating(job.getSelectedTradesman());

        return saved;
    }

    private void updateTradesmanRating(User tradesman) {
        List<Review> reviews = reviewRepository.findByTradesmanId(tradesman.getId());

        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);

        tradesman.setRating(avg);
        userRepository.save(tradesman);
    }

    public List<Review> getReviewsForTradesman(Integer tradesmanId) {
        return reviewRepository.findByTradesmanId(tradesmanId);
    }
}
