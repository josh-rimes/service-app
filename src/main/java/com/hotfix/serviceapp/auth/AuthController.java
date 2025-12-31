package com.hotfix.serviceapp.auth;

import com.hotfix.serviceapp.users.LoginRequestDto;
import com.hotfix.serviceapp.users.RegisterRequestDto;
import com.hotfix.serviceapp.users.User;
import com.hotfix.serviceapp.users.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userservice;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserService userservice, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userservice = userservice;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequestDto request) {
        return userservice.register(request);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequestDto request) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email,
                        request.password
                )
        );

        User user = (User) auth.getPrincipal();
        return jwtService.generateToken(user);
    }
}
