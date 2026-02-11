package com.hotfix.serviceapp.quotes;

import com.hotfix.serviceapp.jobs.Job;
import com.hotfix.serviceapp.jobs.JobRepository;
import com.hotfix.serviceapp.jobs.JobStatus;
import com.hotfix.serviceapp.users.Role;
import com.hotfix.serviceapp.users.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuoteService {

    private final QuoteRepository quoteRepository;
    private final JobRepository jobRepository;

    public QuoteService(QuoteRepository quoteRepository, JobRepository jobRepository) {
        this.quoteRepository = quoteRepository;
        this.jobRepository = jobRepository;
    }

    public Quote createQuote(CreateQuoteRequestDto request, User tradesman) {

        Job job = jobRepository.findById(request.jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        if (tradesman.getRole() != Role.TRADESMAN) {
            throw new RuntimeException("Only tradesmen can quote");
        }

        quoteRepository.findByJobIdAndTradesmanId(job.getId(), tradesman.getId())
                .ifPresent(_ -> {
                    throw new RuntimeException("Quote assigned to your account already exists");
                });

        job.setStatus(JobStatus.QUOTED);
        jobRepository.save(job);

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

    public List<Quote> getQuotesForTradesman(Integer tradesmanId) {
        return quoteRepository.findByTradesmanId(tradesmanId);
    }
}
