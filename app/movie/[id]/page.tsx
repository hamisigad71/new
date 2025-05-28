"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { type MovieDetails, type Credits, tmdbApi } from "@/lib/tmdb"
import { Star, Calendar, Clock, Play, ArrowLeft, Heart, Share2, Info } from "lucide-react"
import { Loader2 } from "lucide-react"

export default function MovieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const movieId = Number.parseInt(params.id as string)
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [credits, setCredits] = useState<Credits | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [movieData, creditsData] = await Promise.all([
          tmdbApi.getMovieDetails(movieId),
          tmdbApi.getMovieCredits(movieId),
        ])
        setMovie(movieData)
        setCredits(creditsData)
      } catch (error) {
        console.error("Error fetching movie data:", error)
        setError("Failed to load movie details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (movieId) {
      fetchMovieData()
    }
  }, [movieId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-foreground/70">Loading movie details...</p>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">{error ? "Error" : "Movie not found"}</h1>
          {error && <p className="text-primary mb-6">{error}</p>}
          <Button onClick={() => router.push("/")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  const director = credits?.crew.find((person) => person.job === "Director")
  const writers = credits?.crew.filter((person) => person.department === "Writing").slice(0, 2) || []
  const mainCast = credits?.cast.slice(0, 6) || []

  // Format runtime to hours and minutes
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        {/* Backdrop Image */}
        <div className="absolute inset-0 h-[70vh] md:h-[80vh] overflow-hidden">
          <Image
            src={tmdbApi.getBackdropUrl(movie.backdrop_path, "original") || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-transparent" />
        </div>

        {/* Back Button */}
        <div className="container relative pt-8 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4 text-foreground/80 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Movie Info */}
        <div className="container relative z-10 px-4 pt-8 pb-16 md:pt-16 md:pb-24 min-h-[70vh] flex items-end">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Poster */}
            <div className="flex-shrink-0 w-48 md:w-64 mx-auto md:mx-0">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={tmdbApi.getImageUrl(movie.poster_path, "w500") || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 md:pt-8">
              <div className="flex flex-wrap gap-2 mb-3">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} className="bg-primary/20 text-primary border-0">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-2">{movie.title}</h1>

              {movie.tagline && <p className="text-lg italic text-foreground/70 mb-4">{movie.tagline}</p>}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-foreground/60 ml-1">({movie.vote_count})</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-1" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Overview</h2>
                <p className="text-foreground/80 leading-relaxed">{movie.overview}</p>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {director && (
                  <div>
                    <h3 className="text-sm font-medium text-foreground/60 mb-1">Director</h3>
                    <p className="font-medium">{director.name}</p>
                  </div>
                )}

                {writers.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-foreground/60 mb-1">Writers</h3>
                    <p className="font-medium">{writers.map((writer) => writer.name).join(", ")}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Trailer
                </Button>
                <Button variant="outline" className="border border-primary/20 hover:bg-primary/10 text-primary">
                  <Heart className="h-5 w-5 mr-2" />
                  Add to Favorites
                </Button>
                <Button variant="outline" className="border border-primary/20 hover:bg-primary/10 text-primary">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cast Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Cast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mainCast.map((actor) => (
            <Card key={actor.id} className="cinema-card cinema-card-hover overflow-hidden">
              <div className="relative aspect-[2/3] overflow-hidden">
                <Image
                  src={tmdbApi.getImageUrl(actor.profile_path, "w185") || "/placeholder.svg"}
                  alt={actor.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm line-clamp-1">{actor.name}</h3>
                <p className="text-xs text-foreground/60 line-clamp-1">{actor.character}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Movie Info Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Movie Details</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2">Synopsis</h3>
                <p className="text-foreground/80 leading-relaxed">{movie.overview}</p>
              </div>

              {movie.production_companies.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-2">Production Companies</h3>
                  <div className="flex flex-wrap gap-4">
                    {movie.production_companies.map((company) => (
                      <div key={company.id} className="flex items-center space-x-2">
                        {company.logo_path ? (
                          <div className="relative h-8 w-16 bg-white rounded p-1">
                            <Image
                              src={tmdbApi.getImageUrl(company.logo_path, "w92") || "/placeholder.svg"}
                              alt={company.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <Info className="h-5 w-5 text-foreground/60" />
                        )}
                        <span className="text-sm">{company.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="cinema-card">
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground/60 mb-1">Status</h3>
                  <p className="font-medium">{movie.status}</p>
                </div>
                <Separator className="bg-muted/30" />

                <div>
                  <h3 className="text-sm font-medium text-foreground/60 mb-1">Release Date</h3>
                  <p className="font-medium">{formatDate(movie.release_date)}</p>
                </div>
                <Separator className="bg-muted/30" />

                <div>
                  <h3 className="text-sm font-medium text-foreground/60 mb-1">Runtime</h3>
                  <p className="font-medium">{formatRuntime(movie.runtime)}</p>
                </div>
                <Separator className="bg-muted/30" />

                <div>
                  <h3 className="text-sm font-medium text-foreground/60 mb-1">Budget</h3>
                  <p className="font-medium">{movie.budget > 0 ? `$${movie.budget.toLocaleString()}` : "N/A"}</p>
                </div>
                <Separator className="bg-muted/30" />

                <div>
                  <h3 className="text-sm font-medium text-foreground/60 mb-1">Revenue</h3>
                  <p className="font-medium">{movie.revenue > 0 ? `$${movie.revenue.toLocaleString()}` : "N/A"}</p>
                </div>
                <Separator className="bg-muted/30" />

                <div>
                  <h3 className="text-sm font-medium text-foreground/60 mb-1">Original Language</h3>
                  <p className="font-medium">{movie.original_language.toUpperCase()}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
