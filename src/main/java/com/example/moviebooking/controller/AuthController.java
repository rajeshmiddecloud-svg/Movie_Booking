package com.example.moviebooking.controller;

import com.example.moviebooking.dto.AuthResponse;
import com.example.moviebooking.dto.LoginRequest;
import com.example.moviebooking.dto.RegisterRequest;
import com.example.moviebooking.entity.AppUser;
import com.example.moviebooking.repository.AppUserRepository;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityContextRepository securityContextRepository;

    public AuthController(
        AppUserRepository appUserRepository,
        PasswordEncoder passwordEncoder,
        SecurityContextRepository securityContextRepository) {

    this.appUserRepository = appUserRepository;
    this.passwordEncoder = passwordEncoder;
    this.securityContextRepository = securityContextRepository;
                        }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        if (request.fullName() == null
                || request.fullName().isBlank()
                || request.email() == null
                || request.email().isBlank()
                || request.password() == null
                || request.password().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Name, email, and password are required.");
        }

        String email = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (appUserRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("An account with this email already exists.");
        }

        AppUser user = new AppUser();
        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPasswordHash(
                passwordEncoder.encode(request.password()));

        AppUser savedUser = appUserRepository.save(user);

        AuthResponse response = new AuthResponse(
                savedUser.getUserId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getCreatedAt());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    
@PostMapping("/login")
public ResponseEntity<?> login(
        @RequestBody LoginRequest request,
        HttpServletRequest httpRequest,
        HttpServletResponse httpResponse) {

    if (request.email() == null
            || request.email().isBlank()
            || request.password() == null
            || request.password().isBlank()) {

        return ResponseEntity.badRequest()
                .body("Email and password are required.");
    }

    String email = request.email()
            .trim()
            .toLowerCase(Locale.ROOT);

    AppUser user = appUserRepository.findByEmail(email)
            .orElse(null);

    if (user == null
            || !passwordEncoder.matches(
                    request.password(),
                    user.getPasswordHash())) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid email or password.");
    }

    Authentication authentication =
            new UsernamePasswordAuthenticationToken(
                    user.getEmail(),
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_USER")));

    SecurityContext context =
            SecurityContextHolder.createEmptyContext();

    context.setAuthentication(authentication);

    SecurityContextHolder.setContext(context);

    securityContextRepository.saveContext(
            context, httpRequest, httpResponse);

    AuthResponse response = new AuthResponse(
            user.getUserId(),
            user.getFullName(),
            user.getEmail(),
            user.getCreatedAt());

    return ResponseEntity.ok(response);
    }

}
