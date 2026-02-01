package com.hotfix.serviceapp.users;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TradesmanProfileRepository extends JpaRepository<TradesmanProfile, Integer> {

    Optional<TradesmanProfile> findByUserId(Integer userId);
}
