package com.hotfix.serviceapp.jobs;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobRepository jobRepository;

    public JobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @PostMapping
    public Job createJob(@RequestBody Job job) {
        job.setStatus(JobStatus.OPEN);
        return jobRepository.save(job);
    }

    @GetMapping
    public List<Job> getJobs() {
        return jobRepository.findAll();
    }

    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Integer id) {
        return jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job Not Found"));
    }
}
