package com.hotfix.serviceapp.auth;

import com.hotfix.serviceapp.users.RegisterRequestDto;
import com.hotfix.serviceapp.users.User;
import com.hotfix.serviceapp.users.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userservice;

    public AuthController(UserService userservice) {
        this.userservice = userservice;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequestDto request) {
        return userservice.register(request);
    }
}
