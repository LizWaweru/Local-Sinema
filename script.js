const API_BASE_URL = "http://localhost:3000/movies";

class MovieApp {
    constructor() {
        this.allMovies = [];
        this.initializeEventListeners();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => this.fetchMovieData());
        
        // Search form event listener
        const searchForm = document.getElementById('searchForm');
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            this.performSearch();
        });

        // Top Movies button
        const topMoviesBtn = document.getElementById('topMoviesBtn');
        topMoviesBtn.addEventListener('click', () => this.displayTopMovies());

        // Latest Movies button
        const latestMoviesBtn = document.getElementById('latestMoviesBtn');
        latestMoviesBtn.addEventListener('click', () => this.displayLatestMovies());
    }

    // Fetch movie data from the API
    async fetchMovieData() {
        try {
            const response = await fetch(API_BASE_URL);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            if (!data || !Array.isArray(data)) {
                throw new Error('Invalid data structure');
            }
            
            this.allMovies = data;
            this.populateCategories(this.allMovies);
            this.displayTopMovies();
            
        } catch (error) {
            this.showErrorMessage(error.message);
        }
    }

    // Populate categories in the sidebar
    populateCategories(categories) {
        const categoryList = document.getElementById('categoryList');
        categoryList.innerHTML = '';

        categories.forEach(categoryObj => {
            const category = categoryObj.category;
            const categoryItem = document.createElement('li');
            const categoryLink = document.createElement('a');
            
            categoryLink.href = '#';
            categoryLink.textContent = this.capitalizeFirstLetter(category);
            categoryLink.addEventListener('click', () => this.displayCategoryMovies(category, categoryObj.items));
            
            categoryItem.appendChild(categoryLink);
            categoryList.appendChild(categoryItem);
        });
    }

    // Display movies for a specific category
    displayCategoryMovies(category, movies) {
        const movieDetails = document.getElementById('movieDetails');
        const categoryTitle = document.getElementById('categoryTitle');
        
        movieDetails.innerHTML = '';
        categoryTitle.textContent = `${this.capitalizeFirstLetter(category)} Movies`;

        if (movies.length > 0) {
            movies.forEach(movie => {
                const movieElement = this.createMovieElement(movie);
                movieDetails.appendChild(movieElement);
            });
        } else {
            movieDetails.innerHTML = '<p>No movies found for this category.</p>';
        }
    }

    // Display top-rated movies
    displayTopMovies() {
        const topMovies = this.allMovies
            .map(categoryObj => ({
                ...categoryObj,
                items: categoryObj.items.filter(movie => parseFloat(movie.Rate) > 5)
            }))
            .filter(category => category.items.length > 0);

        const movieDetails = document.getElementById('movieDetails');
        const categoryTitle = document.getElementById('categoryTitle');
        
        movieDetails.innerHTML = '';
        categoryTitle.textContent = 'Top Movies';

        topMovies.forEach(categoryObj => {
            const categorySection = document.createElement('div');
            const categoryHeader = document.createElement('h2');
            
            categoryHeader.textContent = `${this.capitalizeFirstLetter(categoryObj.category)} Top Movies`;
            categorySection.appendChild(categoryHeader);

            categoryObj.items.forEach(movie => {
                const movieElement = this.createMovieElement(movie);
                categorySection.appendChild(movieElement);
            });

            movieDetails.appendChild(categorySection);
        });
    }

    // Display latest movies (released in the current year)
    displayLatestMovies() {
        const currentYear = new Date().getFullYear();
        
        const latestMovies = this.allMovies
            .map(categoryObj => ({
                ...categoryObj,
                items: categoryObj.items.filter(movie => 
                    parseInt(movie.release_date, 10) === currentYear
                )
            }))
            .filter(category => category.items.length > 0);

        const movieDetails = document.getElementById('movieDetails');
        const categoryTitle = document.getElementById('categoryTitle');
        
        movieDetails.innerHTML = '';
        categoryTitle.textContent = 'Latest Movies';

        latestMovies.forEach(categoryObj => {
            const categorySection = document.createElement('div');
            const categoryHeader = document.createElement('h2');
            
            categoryHeader.textContent = `${this.capitalizeFirstLetter(categoryObj.category)} Latest Movies`;
            categorySection.appendChild(categoryHeader);

            categoryObj.items.forEach(movie => {
                const movieElement = this.createMovieElement(movie);
                categorySection.appendChild(movieElement);
            });

            movieDetails.appendChild(categorySection);
        });
    }

    // Perform movie search
    performSearch() {
        const searchInput = document.getElementById('movieSearch');
        const query = searchInput.value.trim().toLowerCase();
        
        const movieDetails = document.getElementById('movieDetails');
        const categoryTitle = document.getElementById('categoryTitle');
        
        movieDetails.innerHTML = '';
        categoryTitle.textContent = 'Search Results';

        // Flatten movies and search
        const allMoviesFlattened = this.allMovies.flatMap(categoryObj => categoryObj.items);
        const filteredMovies = allMoviesFlattened.filter(movie => 
            movie.title.toLowerCase().includes(query)
        );

        if (filteredMovies.length > 0) {
            filteredMovies.forEach(movie => {
                const movieElement = this.createMovieElement(movie);
                movieDetails.appendChild(movieElement);
            });
        } else {
            movieDetails.innerHTML = '<p>No movies found for the search.</p>';
        }
    }

    // Create movie element with consistent formatting
    createMovieElement(movie) {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-item');
        
        movieElement.innerHTML = `
            <img src="${movie.image}" alt="${movie.title} poster" loading="lazy">
            <h3>${movie.title}</h3>
            <p>${movie.description}</p>
            <div class="movie-metadata">
                <p><strong>Release Date:</strong> ${movie.release_date}</p>
                <p><strong>Cast:</strong> ${movie.cast.join(', ')}</p>
                <p><strong>Rating:</strong> ${movie.Rate || 'N/A'}</p>
            </div>
            <a href="${movie.trailer}" target="_blank" rel="noopener noreferrer">Watch Trailer</a>
        `;

        return movieElement;
    }

    // Utility method to capitalize first letter
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Show error message to user
    showErrorMessage(message) {
        const movieDetails = document.getElementById('movieDetails');
        movieDetails.innerHTML = `
            <div class="error-message">
                <h3>Error Loading Movies</h3>
                <p>${message}</p>
                <button onclick="window.location.reload()">Retry</button>
            </div>
        `;
    }
}

// Initialize the application
const movieApp = new MovieApp();