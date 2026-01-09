package com.hotfix.serviceapp.jobs;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
class JobIT {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    void shouldCreateJobWithOpenStatus() throws Exception {
        Job job = new Job();
        job.setTitle("Fix sink");
        job.setDescription("Leaking pipe");
        job.setLocation("CF82 7FN");

        String response = mockMvc.perform(post("/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(job)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("OPEN"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Job savedJob = objectMapper.readValue(response, Job.class);

        assertThat(savedJob.getId()).isNotNull();
        assertThat(jobRepository.findById(savedJob.getId())).isPresent();
    }

    @Test
    void shouldReturnAllJobs() throws Exception {
        Job job = new Job();
        job.setTitle("Paint fence");
        job.setDescription("Back garden fence");
        job.setLocation("CF82 7FN");
        job.setStatus(JobStatus.OPEN);

        jobRepository.save(job);

        mockMvc.perform(get("/jobs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].title").value("Paint fence"));
    }

    @Test
    void shouldReturnJobById() throws Exception {
        Job job = new Job();
        job.setTitle("Fix door");
        job.setDescription("Broken hinge");
        job.setLocation("CF82 7FN");
        job.setStatus(JobStatus.OPEN);

        Job savedJob = jobRepository.save(job);

        mockMvc.perform(get("/jobs/{id}", savedJob.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Fix door"));
    }

    @Test
    void shouldReturnErrorWhenJobNotFound() throws Exception {
        mockMvc.perform(get("/jobs/{id}", 9999))
                .andExpect(status().isInternalServerError());
    }
}
