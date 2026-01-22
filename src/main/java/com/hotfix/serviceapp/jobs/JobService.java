package com.hotfix.serviceapp.jobs;

import com.hotfix.serviceapp.quotes.Quote;
import com.hotfix.serviceapp.quotes.QuoteRepository;
import com.hotfix.serviceapp.quotes.QuoteStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final QuoteRepository quoteRepository;

    public JobService(JobRepository jobRepository, QuoteRepository quoteRepository) {
        this.jobRepository = jobRepository;
        this.quoteRepository = quoteRepository;
    }

    public Job selectQuote(Integer jobId, Integer quoteId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Quote selectedQuote = quoteRepository.findById(quoteId)
                .orElseThrow(() -> new RuntimeException("Quote not found"));

        if (!selectedQuote.getJob().getId().equals(jobId)) {
            throw new RuntimeException("Quote does not belong to this Job");
        }

        selectedQuote.setStatus(QuoteStatus.ACCEPTED);

        for (Quote quote : job.getQuotes()) {
            if (!quote.getId().equals(quoteId)) {
                quote.setStatus(QuoteStatus.REJECTED);
            }
        }

        job.setStatus(JobStatus.QUOTED);
        job.setSelectedTradesman(selectedQuote.getTradesman());

        return jobRepository.save(job);
    }

    public List<Job> findByCustomerId(Integer customerID) {
        return jobRepository.findByCustomerId(customerID);
    }
}
