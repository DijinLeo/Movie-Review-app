let movies = [
    {
        title: "Inception",
        genre: "Sci-Fi",
        director: "Christopher Nolan",
        cast: "Leonardo DiCaprio",
        reviews: []
    },
    {
        title: "Interstellar",
        genre: "Sci-Fi",
        director: "Christopher Nolan",
        cast: "Matthew McConaughey",
        reviews: []
    }
];

let currentSearch = "";
let currentGenre = "All";

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
}

function getFilteredMovies() {
    return movies.filter((movie) => {
        const matchesSearch = movie.title.toLowerCase().includes(currentSearch);
        const matchesGenre = currentGenre === "All" || movie.genre === currentGenre;
        return matchesSearch && matchesGenre;
    });
}

function updateGenreOptions() {
    const genreFilter = document.getElementById("genreFilter");
    const genres = [...new Set(movies.map((movie) => movie.genre.trim()).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b)
    );

    genreFilter.innerHTML = `<option value="All">All Genres</option>`;

    genres.forEach((genre) => {
        genreFilter.innerHTML += `<option value="${escapeHTML(genre)}">${escapeHTML(genre)}</option>`;
    });

    const genreStillExists = genres.includes(currentGenre);
    if (!genreStillExists && currentGenre !== "All") {
        currentGenre = "All";
    }

    genreFilter.value = currentGenre;
}

function updateSummary(filteredMovies) {
    const totalReviews = movies.reduce((count, movie) => count + movie.reviews.length, 0);

    document.getElementById("movieCount").textContent = filteredMovies.length;
    document.getElementById("reviewCount").textContent = totalReviews;
}

function getAverageRating(reviews) {
    if (reviews.length === 0) {
        return "No ratings";
    }

    const total = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
    return `${(total / reviews.length).toFixed(1)}/5`;
}

function displayMovies(list) {
    const container = document.getElementById("movieList");
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No movies found</h3>
                <p>Try a different search or add a new movie to your collection.</p>
            </div>
        `;
        updateSummary(list);
        return;
    }

    list.forEach((movie) => {
        const movieIndex = movies.indexOf(movie);
        const averageRating = getAverageRating(movie.reviews);
        const reviewsHTML = movie.reviews.length
            ? movie.reviews
                  .map(
                      (review) => `
                        <div class="review-item">
                            <strong>${escapeHTML(review.author)}</strong>
                            <span class="review-rating">Rating: ${escapeHTML(review.rating)}/5</span>
                            <p>${escapeHTML(review.text)}</p>
                        </div>
                    `
                  )
                  .join("")
            : `<p class="review-empty">No reviews yet. Add the first one.</p>`;

        container.innerHTML += `
            <article class="movieCard">
                <div class="movie-header">
                    <div>
                        <h3>${escapeHTML(movie.title)}</h3>
                        <p class="movie-subtitle">${escapeHTML(movie.genre)}</p>
                    </div>
                    <div class="movie-actions">
                        <span class="avg-rating">${escapeHTML(averageRating)}</span>
                        <button type="button" class="delete-btn" onclick="deleteMovie(${movieIndex})">Delete</button>
                    </div>
                </div>

                <p class="movie-meta"><strong>Director:</strong> ${escapeHTML(movie.director)}</p>
                <p class="movie-meta"><strong>Cast:</strong> ${escapeHTML(movie.cast)}</p>

                <div class="reviewBox">
                    <div class="review-form">
                        <input id="author${movieIndex}" placeholder="Your name">
                        <input id="review${movieIndex}" placeholder="Write a short review">
                        <input id="rating${movieIndex}" placeholder="1-5" type="number" min="1" max="5">
                        <button type="button" class="primary-btn" onclick="addReview(${movieIndex})">Add Review</button>
                    </div>
                    <div class="review-list">${reviewsHTML}</div>
                </div>
            </article>
        `;
    });

    updateSummary(list);
}

function refreshMovies() {
    updateGenreOptions();
    displayMovies(getFilteredMovies());
}

function addMovie() {
    const title = document.getElementById("title").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const director = document.getElementById("director").value.trim();
    const cast = document.getElementById("cast").value.trim();

    if (!title || !genre || !director || !cast) {
        return;
    }

    movies.unshift({
        title,
        genre,
        director,
        cast,
        reviews: []
    });

    document.getElementById("title").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("director").value = "";
    document.getElementById("cast").value = "";

    currentSearch = "";
    currentGenre = "All";
    document.getElementById("search").value = "";

    refreshMovies();
}

function addReview(index) {
    const author = document.getElementById(`author${index}`).value.trim();
    const text = document.getElementById(`review${index}`).value.trim();
    const rating = document.getElementById(`rating${index}`).value.trim();

    if (!author || !text || !rating) {
        return;
    }

    movies[index].reviews.push({
        author,
        text,
        rating
    });

    refreshMovies();
}

function deleteMovie(index) {
    movies.splice(index, 1);
    refreshMovies();
}

document.getElementById("search").addEventListener("input", function () {
    currentSearch = this.value.toLowerCase().trim();
    refreshMovies();
});

document.getElementById("genreFilter").addEventListener("change", function () {
    currentGenre = this.value;
    refreshMovies();
});

function sortAZ() {
    movies.sort((a, b) => a.title.localeCompare(b.title));
    refreshMovies();
}

function sortZA() {
    movies.sort((a, b) => b.title.localeCompare(a.title));
    refreshMovies();
}

refreshMovies();
