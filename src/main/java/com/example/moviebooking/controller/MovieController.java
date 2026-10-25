
package com.example.moviebooking.controller;

import com.example.moviebooking.dto.MovieCreateRequest;
import com.example.moviebooking.dto.MovieUpdateRequest;
import com.example.moviebooking.entity.Movie;
import com.example.moviebooking.repository.MovieRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieRepository movieRepository;

    public MovieController(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @PostMapping
    public Movie addMovie(@RequestBody MovieCreateRequest request) {
        Movie movie = new Movie();
        movie.setMovieName(request.movieName());
        movie.setLanguage(request.language());
        movie.setDurationMinutes(request.durationMinutes());
        movie.setTicketPrice(request.ticketPrice());

        return movieRepository.save(movie);
    }

    @PutMapping("/{id}")
    public Movie updateMovie(
            @PathVariable Integer id,
            @RequestBody MovieUpdateRequest request) {

        Movie movie = movieRepository.findById(id)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Movie not found"));

        movie.setMovieName(request.movieName());
        movie.setLanguage(request.language());
        movie.setDurationMinutes(request.durationMinutes());
        movie.setTicketPrice(request.ticketPrice());

        return movieRepository.save(movie);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Integer id) {
        if (!movieRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Movie not found");
        }

        movieRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
