package com.hotfix.serviceapp.users;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    public UserService(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    public User register(RegisterRequestDto request) {
        User user = new User();
        user.setName(request.name);
        user.setEmail(request.email);
        user.setPassword(encoder.encode(request.password));
        user.setRole(request.role);
        user.setRating(0.0);

        return userRepository.save(user);
    }
}
