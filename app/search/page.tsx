"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { MovieGrid } from "@/components/movies/movie-grid"
import { Pagination } from "@/components/movies/pagination"
import { type Movie, tmdbApi } from "@/lib/tmdb"
import { Search, Film, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchInput, setSearchInput] = useState(query)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const searchMovies = async (searchQuery: string, page = 1) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await tmdbApi.searchMovies(searchQuery, page)
      setMovies(response.results)
      setTotalPages(Math.min(response.total_pages, 500))
      setTotalResults(response.total_results)
      setCurrentPage(page)
    } catch (error) {
      console.error("Error searching movies:", error)
      setMovies([])
      setTotalResults(0)
      setError("Failed to search movies. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query) {
      setSearchInput(query)
      setCurrentPage(1)
      searchMovies(query, 1)
    }
  }, [query])

  const handlePageChange = (page: number) => {
    searchMovies(query, page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(searchInput.trim())}`)
      searchMovies(searchInput.trim(), 1)
    }
  }

  const clearSearch = () => {
    setSearchInput("")
    setMovies([])
    setTotalResults(0)
    window.history.pushState({}, "", `/search`)
  }

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <section className="bg-gradient-to-br from-primary to-secondary py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
            {query ? "Search Results" : "Find Your Favorite Movies"}
          </h1>

          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/50" />
            <Input
              type="search"
              placeholder="Search for movies by title, actor, or keyword..."
              className="bg-muted/50 border-muted rounded-md focus:ring-primary/20 focus:border-primary pl-12 pr-12 py-6 text-lg rounded-full shadow-lg"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-20 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <Button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
            >
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 py-12">
        {query ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">
                {loading ? "Searching..." : `Found ${totalResults.toLocaleString()} results for "${query}"`}
              </h2>
              {!loading && totalResults > 0 && (
                <p className="text-foreground/70">
                  Showing page {currentPage} of {totalPages}
                </p>
              )}
            </div>

            <MovieGrid movies={movies} loading={loading} />

            {error && !loading && (
              <div className="text-center py-8 mt-4">
                <p className="text-primary">{error}</p>
              </div>
            )}

            {!loading && movies.length > 0 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}

            {!loading && movies.length === 0 && query && (
              <div className="text-center py-12">
                <Film className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">No movies found</h2>
                <p className="text-foreground/70 mb-6">Try searching with different keywords or check your spelling</p>
                <Button onClick={clearSearch} className="border border-primary/20 hover:bg-primary/10 text-primary">
                  Clear Search
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Film className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Start Your Movie Search</h2>
            <p className="text-foreground/70">Enter a movie title, actor name, or keyword in the search box above</p>
          </div>
        )}
      </section>
    </div>
  )
}
