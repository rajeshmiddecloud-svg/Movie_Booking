
import { useEffect, useState } from 'react'
import './App.css'
 

function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showLogin, setShowLogin] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authError, setAuthError] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);


const handleAuth = async (event) => {
  event.preventDefault();

  setAuthMessage('');
  setAuthError(false);
  setAuthLoading(true);

  const endpoint =
    authMode === 'register' ? 'register' : 'login';

  const requestBody =
    authMode === 'register'
      ? {
          fullName: fullName.trim(),
          email: loginEmail.trim(),
          password: loginPassword,
        }
      : {
          email: loginEmail.trim(),
          password: loginPassword,
        };

  try {
    const response = await fetch(
      `http://localhost:8080/api/auth/${endpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : 'Authentication failed. Please try again.'
      );
    }

    
setCurrentUser(data);
setAuthError(false);

if (authMode === 'register') {
  setAuthMessage('Registration successful! Your account has been created.');
  setAuthMode('login');
  setLoginPassword('');
} else {
  setShowLogin(false);
  setAuthMessage('');
  setLoginPassword('');
}


    if (authMode === 'register') {
      setAuthMode('login');
      setLoginPassword('');
    }
  } catch (error) {
    setAuthMessage(
      error.message || 'Could not connect to the backend.'
    );
    setAuthError(true);
  } finally {
    setAuthLoading(false);
  }
};


  useEffect(() => {
    fetch('http://localhost:8080/api/movies')
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load movies')
        return response.json()
      })
      .then((data) => setMovies(data))
      .catch(() =>
        setError('Could not load movies. Please check your backend.')
      )
      .finally(() => setLoading(false))
  }, [])

  const filteredMovies = movies.filter((movie) =>
    `${movie.movieName} ${movie.language}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="app">


{showLogin && (
  <div className="login-overlay">
    <div className="login-modal">
      <button
        className="login-close"
        onClick={() => {
          setShowLogin(false);
          setAuthMessage('');
        }}
      >
        ×
      </button>

      <h2>
        {authMode === 'register'
          ? 'Create your account'
          : 'Welcome back'}
      </h2>

      <p>
        {authMode === 'register'
          ? 'Join CineBook and plan your next movie night'
          : 'Sign in to continue to CineBook'}
      </p>

      <form onSubmit={handleAuth}>
        {authMode === 'register' && (
          <>
            <label>Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Enter your full name"
              required
            />
          </>
        )}

        <label>Email</label>
        <input
          type="email"
          value={loginEmail}
          onChange={(event) => setLoginEmail(event.target.value)}
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={loginPassword}
          onChange={(event) => setLoginPassword(event.target.value)}
          placeholder="Enter your password"
          minLength={authMode === 'register' ? 8 : undefined}
          required
        />

        {authMessage && (
          <p
            className={authError ? 'auth-message error' : 'auth-message'}
            role="status"
          >
            {authMessage}
          </p>
        )}

        <button
          type="submit"
          className="sign-in"
          disabled={authLoading}
        >
          {authLoading
            ? 'Please wait...'
            : authMode === 'register'
              ? 'Create account'
              : 'Sign in'}
        </button>
      </form>

      <p className="auth-switch">
        {authMode === 'register'
          ? 'Already have an account? '
          : "Don't have an account? "}

        <button
          type="button"
          onClick={() => {
            setAuthMode(
              authMode === 'register' ? 'login' : 'register'
            );
            setAuthMessage('');
            setAuthError(false);
          }}
        >
          {authMode === 'register' ? 'Sign in' : 'Register'}
        </button>
      </p>
    </div>
  </div>
)}

      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-icon">▰</span>
          Cine<span className="brand-accent">Book</span>
        </a>

        <div className="location">
          <span className="location-pin">⌖</span>
          <div>
            <strong>Hyderabad</strong>
            <small>Telangana, India</small>
          </div>
          <span>⌄</span>
        </div>

        <div className="search-box">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search movies or languages..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search movies"
          />
          {search && (
            <button
              className="clear-search"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        
{currentUser ? (
  <div className="user-menu">
    <span>Welcome back, {currentUser.fullName}!</span>
    <button
      className="sign-in"
      onClick={() => {
        setCurrentUser(null);
        setLoginEmail('');
        setLoginPassword('');
        setAuthMessage('');
        setAuthMode('login');
      }}
    >
      Sign out
    </button>
  </div>
) : (
  <button
    className="sign-in"
    onClick={() => {
      setAuthMode('login');
      setAuthMessage('');
      setShowLogin(true);
    }}
  >
    Sign in
  </button>
)}

      </header>

      <nav className="subnav">
        <a className="active" href="#movies">Movies</a>
        <a href="#cinemas" onClick={(e) => {
          e.preventDefault()
          alert('Cinema listings coming soon!')
        }}>Cinemas</a>
        <a href="#offers" onClick={(e) => {
          e.preventDefault()
          alert('Offers coming soon!')
        }}>Offers</a>
        <span className="nav-note">YOUR CITY. YOUR MOVIES. YOUR MOMENT.</span>
      </nav>

      <main id="home">
        <section className="hero">
          <div className="hero-content">
            <span className="hero-tag">✦ THE MAGIC OF CINEMA</span>
            <h1>
              Big stories.
              <br />
              <span>Unforgettable</span>
              <br />
              moments.
            </h1>
            <p>
              Your next favorite movie is just a ticket away.
              Discover what's playing and plan your perfect movie night.
            </p>
            <a className="hero-button" href="#movies">
              Explore movies <span>→</span>
            </a>
            <div className="hero-footnote">
              <span className="live-dot"></span>
              YOUR NEXT MOVIE NIGHT STARTS HERE
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>
            <div className="hero-ticket">
              <span className="ticket-top">CINEBOOK ORIGINAL</span>
              <div className="ticket-symbol">▶</div>
              <span className="ticket-bottom">YOUR STORY STARTS HERE</span>
            </div>
            <span className="spark spark-one">✦</span>
            <span className="spark spark-two">✧</span>
            <span className="spark spark-three">✦</span>
          </div>
        </section>

        <section className="movie-section" id="movies">
          <div className="section-heading">
            <div>
              <p className="section-label">HANDPICKED FOR YOU</p>
              <h2>Now showing <span>in Hyderabad</span></h2>
              <p className="section-subtitle">
                Find your film. Grab your seats. Enjoy the show.
              </p>
            </div>
            <div className="movie-count">
              <strong>{filteredMovies.length}</strong>
              <span>{filteredMovies.length === 1 ? 'MOVIE' : 'MOVIES'}</span>
            </div>
          </div>

          {loading && (
            <p className="status-message">Loading your movies...</p>
          )}

          {error && (
            <p className="status-message error">{error}</p>
          )}

          {!loading && !error && filteredMovies.length === 0 && (
            <div className="empty-state">
              <span>🎬</span>
              <h3>No movies found</h3>
              <p>Try another movie title or language.</p>
              <button onClick={() => setSearch('')}>Show all movies</button>
            </div>
          )}

          {!loading && !error && filteredMovies.length > 0 && (
            <div className="movie-grid">
              {filteredMovies.map((movie, index) => (
                <article className="movie-card" key={movie.movieId}>
                  <div className={`poster poster-${index % 5}`}>
                    <div className="poster-top">
                      <span className="poster-brand">CB / CINEMA</span>
                      <span className="poster-rating">★ 8.{8 - (index % 4)}</span>
                    </div>

                    <div className="poster-center">
                      <span className="poster-line"></span>
                      <span className="poster-play">▶</span>
                      <h3>{movie.movieName}</h3>
                      <p>EXPERIENCE THE MAGIC</p>
                    </div>

                    <span className="poster-language">{movie.language}</span>
                  </div>

                  <div className="movie-details">
                    <div className="movie-title-row">
                      <h3>{movie.movieName}</h3>
                      <span className="language-chip">{movie.language}</span>
                    </div>

                    <p className="movie-meta">
                      <span>◷</span> {movie.durationMinutes} min
                      <span className="meta-dot">•</span>
                      <span>🎬</span> Cinema
                    </p>

                    <div className="movie-divider"></div>

                    <div className="movie-footer">
                      <div>
                        <span className="price-label">TICKETS FROM</span>
                        <p className="price">
                          ₹{Number(movie.ticketPrice).toFixed(0)}
                        </p>
                      </div>
                      <button
                        className="book-button"
                        onClick={() =>
                          alert(
                            `You selected ${movie.movieName}. Showtimes and seat selection are the next features we'll build!`
                          )
                        }
                      >
                        Book tickets <span>→</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="coming-soon" id="offers">
          <div>
            <span className="section-label">MORE MAGIC AWAITS</span>
            <h2>Your next great story is waiting.</h2>
            <p>Stay tuned for new releases, special offers, and more.</p>
          </div>
          <span className="coming-icon">✦</span>
        </section>
      </main>

      <footer className="footer">
        <a className="footer-brand" href="#home">CineBook</a>
        <span>Made for movie lovers, one ticket at a time.</span>
        <span>© 2026 CineBook</span>
      </footer>
    </div>
  )
}

export default App
