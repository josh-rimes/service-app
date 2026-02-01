package com.hotfix.serviceapp.users;

import org.springframework.stereotype.Service;

@Service
public class TradesmanProfileService {

    private final TradesmanProfileRepository tradesmanProfileRepository;

    public TradesmanProfileService(TradesmanProfileRepository tradesmanProfileRepository) {
        this.tradesmanProfileRepository = tradesmanProfileRepository;
    }

    public TradesmanProfile getOrCreate(User user) {

        return tradesmanProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    TradesmanProfile profile = new TradesmanProfile();
                    profile.setUser(user);
                    return tradesmanProfileRepository.save(profile);
                });
    }

    public TradesmanProfile update(User user, UpdateTradesmanProfileRequestDto request) {
        TradesmanProfile profile = getOrCreate(user);

        profile.setBio(request.bio);
        profile.setSkills(request.skills);
        profile.setLocation(request.location);

        return tradesmanProfileRepository.save(profile);
    }
}
