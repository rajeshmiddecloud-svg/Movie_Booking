package com.example.moviebooking.controller;

import com.example.moviebooking.dto.MovieCreateRequest;
import com.example.moviebooking.dto.MovieUpdateRequest;
import com.example.moviebooking.entity.Movie;
import com.example.moviebooking.repository.MovieRepository;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class MovieControllerTest {

    @Mock
    private MovieRepository movieRepository;

    @InjectMocks
    private MovieController movieController;

    private Movie movie;

    @BeforeEach
    void setUp() {
        movie = new Movie();
        movie.setMovieId(1);
        movie.setMovieName("Inception");
        movie.setLanguage("English");
        movie.setDurationMinutes(148);
        movie.setTicketPrice(new BigDecimal("320.00"));
    }

    @Test
    void addMovie_shouldSaveAndReturnMovie() {
        MovieCreateRequest request = new MovieCreateRequest(
                "Inception",
                "English",
                148,
                new BigDecimal("320.00")
        );

        when(movieRepository.save(any(Movie.class))).thenReturn(movie);

        Movie createdMovie = movieController.addMovie(request);

        assertNotNull(createdMovie);
        assertEquals("Inception", createdMovie.getMovieName());
        verify(movieRepository).save(any(Movie.class));
    }

    @Test
    void updateMovie_shouldUpdateExistingMovie() {
        MovieUpdateRequest request = new MovieUpdateRequest(
                "Interstellar",
                "English",
                169,
                new BigDecimal("350.00")
        );

        when(movieRepository.findById(1)).thenReturn(Optional.of(movie));
        when(movieRepository.save(any(Movie.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Movie result = movieController.updateMovie(1, request);

        assertEquals("Interstellar", result.getMovieName());
        assertEquals("English", result.getLanguage());
        assertEquals(169, result.getDurationMinutes());
        assertEquals(new BigDecimal("350.00"), result.getTicketPrice());
        verify(movieRepository).save(any(Movie.class));
    }

    @Test
    void deleteMovie_shouldDeleteMovieWhenFound() {
        when(movieRepository.existsById(1)).thenReturn(true);

        movieController.deleteMovie(1);

        verify(movieRepository).deleteById(1);
    }

    @Test
    void deleteMovie_shouldThrowNotFoundWhenMissing() {
        when(movieRepository.existsById(99)).thenReturn(false);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> movieController.deleteMovie(99)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }
}
