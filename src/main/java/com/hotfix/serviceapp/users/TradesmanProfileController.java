package com.hotfix.serviceapp.users;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/tradesman/profile")
public class TradesmanProfileController {

    private final TradesmanProfileService tradesmanProfileService;

    public TradesmanProfileController(TradesmanProfileService tradesmanProfileService) {
        this.tradesmanProfileService = tradesmanProfileService;
    }

    @GetMapping
    public TradesmanProfile getProfile() {
        User user = (User) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();

        return tradesmanProfileService.getOrCreate(user);
    }

    @PutMapping
    public TradesmanProfile updateProfile(@RequestBody UpdateTradesmanProfileRequestDto request) {
        User user = (User) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication().getPrincipal());

        return tradesmanProfileService.update(user, request);
    }
}
