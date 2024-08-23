
let timeout;
const apiKey = "4d5781c1";
const resultsDiv = document.getElementById('results');
const modal = document.getElementById('myModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalContent = document.getElementById('modalContent');

// Array of keywords to fetch different movies each time
const defaultSearchTerms = ["action", "comedy", "drama", "adventure", "sci-fi", "horror", "romance", "thriller", "mystery"];
let currentPage = 1;
let currentSearchTerm = "";
let loading = false;

document.addEventListener('DOMContentLoaded', () => {
    // Call searchMovies with a random keyword from the array
    const randomTerm = defaultSearchTerms[Math.floor(Math.random() * defaultSearchTerms.length)];
    currentSearchTerm = randomTerm;
    searchMovies();
});

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
        // Load more movies if near the bottom of the page and not currently loading
        currentPage++;
        searchMovies();
    }
});

function debounceSearch() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        currentPage = 1; // Reset to the first page on a new search
        resultsDiv.innerHTML = ''; // Clear previous results
        searchMovies();
    }, 500);
}

async function searchMovies() {
    loading = true;
    const query = document.getElementById('search').value;
    
    let url = `https://www.omdbapi.com/?apikey=${apiKey}&page=${currentPage}`;
    if (query) {
        url += `&s=${query}`;
        currentSearchTerm = query; // Save the current search term
    } else {
        url += `&s=${currentSearchTerm}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    
    if (data.Response === "True") {
        displayMovies(data.Search);
    } else if (currentPage === 1) {
        resultsDiv.innerHTML = 'No movies found';
    }
    loading = false;
}

function displayMovies(movies) {
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        `;
        movieCard.onclick = () => showMovieDetails(movie.imdbID);
        resultsDiv.appendChild(movieCard);
    });
}

async function showMovieDetails(id) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`);
    const data = await response.json();
    
    modalContent.innerHTML = `
        <h2>${data.Title} (${data.Year})</h2>
        <img src="${data.Poster}" alt="${data.Title}">
        <p>${data.Plot}</p>
        <p><strong>Cast:</strong> ${data.Actors}</p>
        <p><strong>Genre:</strong> ${data.Genre}</p>
        <p><strong>Released:</strong> ${data.Released}</p>
    `;
    modal.style.display = "block";
}

// Close the modal
closeModalBtn.onclick = function() {
    modal.style.display = "none";
}

// Close the modal when clicking outside the modal content
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

