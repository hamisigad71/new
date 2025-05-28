import type { Movie } from "@/lib/tmdb"
import { MovieCard } from "./movie-card"

interface MovieGridProps {
  movies: Movie[]
  loading?: boolean
}

export function MovieGrid({ movies, loading }: MovieGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="cinema-card animate-pulse">
            <div className="aspect-[2/3] bg-cinema-muted/50 rounded-t-lg" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-cinema-muted/50 rounded w-3/4" />
              <div className="h-3 bg-cinema-muted/50 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-cinema-foreground/70">No movies found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
