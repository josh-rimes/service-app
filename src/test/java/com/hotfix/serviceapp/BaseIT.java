package com.hotfix.serviceapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.*;
import org.springframework.core.task.SyncTaskExecutor;
import org.springframework.core.task.TaskExecutor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

/**
 * Base class for all Spring Boot integration tests.

 * Responsibilities:
 *  - Boot full application context on a random port
 *  - Provide test-safe infrastructure (DB, async, security)
 *  - Expose reusable helpers for HTTP, JPA, and security

 * Child tests should extend this class and focus only on behaviour.
 */
@AutoConfigureTestRestTemplate
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Import(BaseIT.IntegrationTestConfig.class)
public abstract class BaseIT {

    @LocalServerPort
    protected int port;

    @Autowired
    protected TestRestTemplate restTemplate;

    @PersistenceContext
    protected EntityManager entityManager;

    /**
     * Flushes pending changes and clears the persistence context.
     * Useful to ensure subsequent reads hit the DB and not the 1st-level cache.
     */
    protected void flushAndClear() {
        if (TransactionSynchronizationManager.isActualTransactionActive()) {
            entityManager.flush();
            entityManager.clear();
        }
    }

    /**
     * Refreshes the given entity from the database.
     * Safe to call even if the entity is detached.
     */
    protected <T> T refresh(T entity) {
        if (entity != null && entityManager.contains(entity)) {
            entityManager.refresh(entity);
        }
        return entity;
    }

    protected HttpHeaders jsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        return headers;
    }

    protected HttpHeaders multipartHeaders(String jwt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setBearerAuth(jwt);
        return headers;
    }

    protected String baseUrl(String path) {
        return "http://localhost:" + port + path;
    }

    /**
     * Test-only bean overrides and infrastructure.

     * This allows:
     *  - Sync async execution
     *  - Stubbing external systems
     *  - Overriding prod beans cleanly
     */
    @TestConfiguration
    static class IntegrationTestConfig {

        /**
         * Forces @Async methods to execute synchronously,
         * making tests deterministic and fast.
         */
        @Bean
        @Primary
        public TaskExecutor taskExecutor() {
            return new SyncTaskExecutor();
        }

        /*
         * Example stubs – uncomment and adapt as needed:
         *
         * @Bean
         * @Primary
         * public ExternalMessagingClient messagingClient() {
         *     return message -> {};
         * }
         *
         * @Bean
         * @Primary
         * public ExternalApiClient externalApiClient() {
         *     return id -> new ExternalApiResponse("stubbed");
         * }
         */

        /**
         * Overrides spring boot security and permits access to all routes in tests.
         */
        @Bean
        public SecurityFilterChain testSecurityFilterChain(HttpSecurity http) {
            http
                    .csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(auth -> auth
                            .anyRequest().permitAll()
                    );

            return http.build();
        }
    }
}
