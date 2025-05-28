const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[]
  runtime: number
  budget: number
  revenue: number
  production_companies: { id: number; name: string; logo_path: string | null }[]
  production_countries: { iso_3166_1: string; name: string }[]
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[]
  status: string
  tagline: string
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface Crew {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Credits {
  cast: Cast[]
  crew: Crew[]
}

export interface MoviesResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

class TMDBApi {
  private async fetchFromTMDB(endpoint: string): Promise<any> {
    const url = `/api/tmdb?endpoint=${encodeURIComponent(endpoint)}`

    try {
      console.log("Making request to:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "default",
      })

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`
        let errorData

        try {
          errorData = await response.json()
          console.error("TMDB API Error Details:", errorData)
          errorMessage = errorData.error || errorData.status_message || errorMessage
        } catch (parseError) {
          console.error("Could not parse error response:", parseError)
          errorMessage = `${response.status} ${response.statusText}`
        }

        console.error("TMDB API error:", response.status, errorMessage)
        throw new Error(`TMDB API error: ${errorMessage}`)
      }

      const data = await response.json()
      console.log("TMDB response received successfully")
      return data
    } catch (error) {
      console.error("Failed to fetch from TMDB:", error)

      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(`TMDB request failed: ${error.message}`)
      } else {
        throw new Error("TMDB request failed: Unknown error")
      }
    }
  }

  async getPopularMovies(page = 1): Promise<MoviesResponse> {
    return await this.fetchFromTMDB(`/movie/popular?page=${page}`)
  }

  async getTopRatedMovies(page = 1): Promise<MoviesResponse> {
    return await this.fetchFromTMDB(`/movie/top_rated?page=${page}`)
  }

  async getNowPlayingMovies(page = 1): Promise<MoviesResponse> {
    return await this.fetchFromTMDB(`/movie/now_playing?page=${page}`)
  }

  async getUpcomingMovies(page = 1): Promise<MoviesResponse> {
    return await this.fetchFromTMDB(`/movie/upcoming?page=${page}`)
  }

  async searchMovies(query: string, page = 1): Promise<MoviesResponse> {
    return await this.fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`)
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return await this.fetchFromTMDB(`/movie/${movieId}`)
  }

  async getMovieCredits(movieId: number): Promise<Credits> {
    return await this.fetchFromTMDB(`/movie/${movieId}/credits`)
  }

  getImageUrl(path: string | null, size = "w500"): string {
    if (!path) return "/placeholder.svg?height=750&width=500"
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  }

  getBackdropUrl(path: string | null, size = "w1280"): string {
    if (!path) return "/placeholder.svg?height=720&width=1280"
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  }
}

export const tmdbApi = new TMDBApi()
