package com.hotfix.serviceapp.jobs;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Integer> {
    List<Job> findByStatus(JobStatus status, Pageable pageable);

    List<Job> findByCustomerId(Integer customerId);

    @Query("SELECT j FROM Job j JOIN j.quotes q WHERE q.tradesman.id = :tradesmanId")
    List<Job> findJobsByTradesmanQuote(@Param("tradesmanId") Integer tradesmanId);
}
