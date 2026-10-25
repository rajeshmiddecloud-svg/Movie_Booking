
package com.example.moviebooking.dto;

public record RegisterRequest(
        String fullName,
        String email,
        String password
) {
}
