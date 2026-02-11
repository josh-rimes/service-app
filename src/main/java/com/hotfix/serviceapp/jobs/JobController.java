package com.hotfix.serviceapp.jobs;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobRepository jobRepository;
    private final JobService jobService;

    public JobController(JobRepository jobRepository, JobService jobService) {
        this.jobRepository = jobRepository;
        this.jobService = jobService;
    }

    @PostMapping
    public Job createJob(@RequestBody Job job) {
        job.setStatus(JobStatus.OPEN);
        return jobRepository.save(job);
    }

    @GetMapping
    public List<Job> getJobs(@RequestParam(required = false) JobStatus status,
                             @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        if (status != null) {
            return jobRepository.findByStatus(status, pageable);
        }
        return jobRepository.findAll(pageable).getContent();
    }

    @GetMapping("/my-quotes")
    public List<Job> getMyQuotedJobs() {
        com.hotfix.serviceapp.users.User user = (com.hotfix.serviceapp.users.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return jobRepository.findJobsByTradesmanQuote(user.getId());
    }

    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Integer id) {
        return jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
    }

    @GetMapping("/customer/{customerId}")
    public List<Job> getJobsByCustomerId(@PathVariable Integer customerId) {
        return jobService.findByCustomerId(customerId);
    }

    @PostMapping("/{jobId}/select/{quoteId}")
    public Job selectQuote(@PathVariable Integer jobId, @PathVariable Integer quoteId) {
        return jobService.selectQuote(jobId, quoteId);
    }
}
