package com.hotfix.serviceapp.jobs;

import com.hotfix.serviceapp.quotes.Quote;
import com.hotfix.serviceapp.quotes.QuoteRepository;
import com.hotfix.serviceapp.quotes.QuoteStatus;
import com.hotfix.serviceapp.users.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class SelectingQuoteTest {

    private JobRepository jobRepository;
    private QuoteRepository quoteRepository;
    private JobService jobService;

    @BeforeEach
    void setUp() {
        jobRepository = mock(JobRepository.class);
        quoteRepository = mock(QuoteRepository.class);
        jobService = new JobService(jobRepository, quoteRepository);
    }

    @Test
    void shouldAcceptSelectedQuoteAndRejectAllOthers() {
        User tradesman = new User();
        tradesman.setId(10);

        Job job = new Job();
        job.setId(1);

        Quote acceptedQuote = new Quote();
        acceptedQuote.setId(100);
        acceptedQuote.setJob(job);
        acceptedQuote.setTradesman(tradesman);

        Quote rejectedQuote = new Quote();
        rejectedQuote.setId(101);
        rejectedQuote.setJob(job);

        job.setQuotes(List.of(acceptedQuote, rejectedQuote));

        when(jobRepository.findById(1)).thenReturn(Optional.of(job));
        when(quoteRepository.findById(100)).thenReturn(Optional.of(acceptedQuote));
        when(jobRepository.save(job)).thenReturn(job);

        Job result = jobService.selectQuote(1, 100);

        assertThat(acceptedQuote.getStatus()).isEqualTo(QuoteStatus.ACCEPTED);
        assertThat(rejectedQuote.getStatus()).isEqualTo(QuoteStatus.REJECTED);
        assertThat(result.getStatus()).isEqualTo(JobStatus.ASSIGNED);
        assertThat(result.getSelectedTradesman()).isEqualTo(tradesman);

        verify(jobRepository).save(job);
    }

    @Test
    void shouldThrowExceptionWhenJobDoesNotExist() {
        when(jobRepository.findById(1)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobService.selectQuote(1, 100))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Job not found");
    }

    @Test
    void shouldThrowExceptionWhenQuoteDoesNotExist() {
        Job job = new Job();
        job.setId(1);

        when(jobRepository.findById(1)).thenReturn(Optional.of(job));
        when(quoteRepository.findById(100)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobService.selectQuote(1, 100))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Quote not found");
    }

    @Test
    void shouldRejectQuoteThatDoesNotBelongToJob() {
        Job job = new Job();
        job.setId(1);

        Job otherJob = new Job();
        otherJob.setId(2);

        Quote quote = new Quote();
        quote.setId(100);
        quote.setJob(otherJob);

        when(jobRepository.findById(1)).thenReturn(Optional.of(job));
        when(quoteRepository.findById(100)).thenReturn(Optional.of(quote));

        assertThatThrownBy(() -> jobService.selectQuote(1, 100))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Quote does not belong to this Job");
    }
}
