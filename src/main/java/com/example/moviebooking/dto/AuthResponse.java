
package com.example.moviebooking.dto;

import java.time.LocalDateTime;

public record AuthResponse(
        Integer userId,
        String fullName,
        String email,
        LocalDateTime createdAt
) {
}
