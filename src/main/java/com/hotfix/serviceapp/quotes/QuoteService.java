package com.hotfix.serviceapp.quotes;

import com.hotfix.serviceapp.jobs.Job;
import com.hotfix.serviceapp.jobs.JobRepository;
import com.hotfix.serviceapp.users.Role;
import com.hotfix.serviceapp.users.User;
import com.hotfix.serviceapp.users.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuoteService {

    private final QuoteRepository quoteRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public QuoteService(QuoteRepository quoteRepository, JobRepository jobRepository, UserRepository userRepository) {
        this.quoteRepository = quoteRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public Quote createQuote(CreateQuoteRequestDto request, Integer tradesmanId) {

        Job job = jobRepository.findById(request.jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        User tradesman = userRepository.findById(tradesmanId).orElseThrow(() -> new RuntimeException("User not found"));

        if (tradesman.getRole() != Role.TRADESMAN) {
            throw new RuntimeException("Only tradesmen can quote");
        }

        quoteRepository.findByJobIdAndTradesmanId(job.getId(), tradesman.getId())
                .ifPresent(quote -> {
                    throw new RuntimeException("Quote assigned to your account already exists");
                });

        Quote quote = new Quote();
        quote.setJob(job);
        quote.setTradesman(tradesman);
        quote.setPriceEstimate(request.priceEstimate);
        quote.setMessage(request.message);
        quote.setStatus(QuoteStatus.PENDING);

        return quoteRepository.save(quote);
    }

    public List<Quote> getQuotesForJob(Integer jobId) {
        return quoteRepository.findByJobId(jobId);
    }
}
