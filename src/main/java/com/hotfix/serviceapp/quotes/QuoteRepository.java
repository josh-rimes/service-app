package com.hotfix.serviceapp.quotes;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuoteRepository extends JpaRepository<Quote, Integer> {

    List<Quote> findByJobId(Integer jobId);

    List<Quote> findByTradesmanId(Integer tradesmanId);

    Optional<Quote> findByJobIdAndTradesmanId(Integer jobId, Integer tradesmanId);
}
