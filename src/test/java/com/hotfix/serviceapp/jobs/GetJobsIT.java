package com.hotfix.serviceapp.jobs;

import com.hotfix.serviceapp.BaseIT;
import com.hotfix.serviceapp.users.User;
import com.hotfix.serviceapp.users.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;


class GetJobsIT extends BaseIT {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    private static final String BASE_PATH = "/jobs";


    @Test
    @DisplayName("GET /jobs/{id} returns the job when it exists")
    void getJobById_returnsJob_whenExists() {
        User user = createAndSaveUser();
        Job job = createAndSaveJob(user);

        flushAndClear();

        ResponseEntity<Job> response =
                restTemplate.getForEntity(baseUrl(BASE_PATH + "/" + job.getId()), Job.class);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(job.getId());
    }

    @Test
    @DisplayName("GET /jobs/{id} fails when job does not exist")
    void getJobById_throws_whenNotFound() {
        ResponseEntity<String> response =
                restTemplate.getForEntity(baseUrl(BASE_PATH + "/999999"), String.class);
        assertThat(response.getStatusCode().value()).isEqualTo(500);
    }

    @Test
    @DisplayName("GET /jobs/customer/{customerId} returns only jobs for that customer")
    void getJobsByCustomerId_returnsOnlyCustomerJobs() {
        User user1 = createAndSaveUser();
        Job job1 = createAndSaveJob(user1);
        Job job2 = createAndSaveJob(user1);

        User user2 = createAndSaveUser();
        createAndSaveJob(user2);

        flushAndClear();

        ResponseEntity<Job[]> response =
                restTemplate.getForEntity(baseUrl(BASE_PATH + "/customer/" + user1.getId()), Job[].class);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody())
                .isNotNull()
                .extracting(Job::getCustomer)
                .extracting(User::getId)
                .containsOnly(user1.getId());
    }

    @Test
    @DisplayName("GET /jobs/customer/{customerId} returns empty list when customer has no jobs")
    void getJobsByCustomerId_returnsEmptyList_whenNoneExist() {
        ResponseEntity<Job[]> response =
                restTemplate.getForEntity(baseUrl(BASE_PATH + "/customer/999"), Job[].class);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isNotNull().isEmpty();
    }

    private User createAndSaveUser() {
        User user = new User();
        user.setName("user");
        return userRepository.save(user);
    }

    private Job createAndSaveJob(User customer) {
        Job job = new Job();
        job.setCustomer(customer);
        return jobRepository.save(job);
    }
}
