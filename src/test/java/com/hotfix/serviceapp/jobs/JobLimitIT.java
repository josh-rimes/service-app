package com.hotfix.serviceapp.jobs;

import com.hotfix.serviceapp.BaseIT;
import com.hotfix.serviceapp.users.User;
import com.hotfix.serviceapp.users.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class JobLimitIT extends BaseIT {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("GET /jobs respects the limit parameter")
    void getJobs_respectsLimit() {
        User user = new User();
        user.setName("test-customer");
        user = userRepository.save(user);

        for (int i = 0; i < 15; i++) {
            Job job = new Job();
            job.setTitle("Job " + i);
            job.setCustomer(user);
            job.setStatus(JobStatus.OPEN);
            jobRepository.save(job);
        }

        // Default limit is 10
        ResponseEntity<Job[]> responseDefault =
                restTemplate.getForEntity(baseUrl("/jobs"), Job[].class);
        assertThat(responseDefault.getBody()).hasSize(10);

        // Custom limit
        ResponseEntity<Job[]> responseCustom =
                restTemplate.getForEntity(baseUrl("/jobs?limit=5"), Job[].class);
        assertThat(responseCustom.getBody()).hasSize(5);
    }

    @Test
    @DisplayName("GET /jobs?status=OPEN returns only open jobs")
    void getJobs_filtersByStatus() {
        User user = new User();
        user.setName("test-customer");
        user = userRepository.save(user);

        Job openJob = new Job();
        openJob.setTitle("Open Job");
        openJob.setCustomer(user);
        openJob.setStatus(JobStatus.OPEN);
        jobRepository.save(openJob);

        Job completedJob = new Job();
        completedJob.setTitle("Completed Job");
        completedJob.setCustomer(user);
        completedJob.setStatus(JobStatus.COMPLETED);
        jobRepository.save(completedJob);

        ResponseEntity<Job[]> response =
                restTemplate.getForEntity(baseUrl("/jobs?status=OPEN"), Job[].class);
        
        assertThat(response.getBody()).extracting(Job::getStatus).containsOnly(JobStatus.OPEN);
        assertThat(response.getBody()).extracting(Job::getTitle).contains("Open Job");
        assertThat(response.getBody()).extracting(Job::getTitle).doesNotContain("Completed Job");
    }
}
