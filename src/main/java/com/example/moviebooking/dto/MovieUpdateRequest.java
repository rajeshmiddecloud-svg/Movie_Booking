package com.example.moviebooking.dto;

import java.math.BigDecimal;

public record MovieUpdateRequest(
        String movieName,
        String language,
        Integer durationMinutes,
        BigDecimal ticketPrice
) {
}
