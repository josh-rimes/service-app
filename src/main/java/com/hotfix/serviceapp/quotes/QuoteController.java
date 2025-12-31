package com.hotfix.serviceapp.quotes;

import com.hotfix.serviceapp.users.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quotes")
public class QuoteController {

    private final QuoteService quoteService;

    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @PostMapping
    public Quote createQuote(@RequestBody CreateQuoteRequestDto request) {

    User tradesman = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return quoteService.createQuote(request, tradesman);
    }

    @GetMapping("/job/{jobId}")
    public List<Quote> getQuotesForJob(@PathVariable Integer jobId) {
        return quoteService.getQuotesForJob(jobId);
    }
}
