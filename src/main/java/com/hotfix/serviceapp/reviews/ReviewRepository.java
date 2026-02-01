package com.hotfix.serviceapp.reviews;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    List<Review> findByTradesmanId(Integer id);

    boolean existsByJobId(Integer jobId);
}
