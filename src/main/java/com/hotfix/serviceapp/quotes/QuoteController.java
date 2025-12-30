package com.hotfix.serviceapp.quotes;

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
    public Quote createQuote(@RequestBody CreateQuoteRequestDto request,
                             @RequestParam Integer tradesmanId) {
        return quoteService.createQuote(request,tradesmanId);
    }

    @GetMapping("/job/{jobId}")
    public List<Quote> getQuotesForJob(@PathVariable Integer jobId) {
        return quoteService.getQuotesForJob(jobId);
    }
}
