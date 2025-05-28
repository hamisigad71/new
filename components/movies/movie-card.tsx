import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Clock, TrendingUp } from "lucide-react";
import type { Movie } from "@/lib/tmdb";
import { tmdbApi } from "@/lib/tmdb";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  // Format release date
  const releaseDate = new Date(movie.release_date);
  const releaseYear = releaseDate.getFullYear();

  // Calculate if movie is new (released in the last 30 days)
  const isNew = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(movie.release_date) >= thirtyDaysAgo;
  };

  // Format vote average with one decimal place
  const rating = movie.vote_average.toFixed(1);

  // Determine rating color
  const getRatingColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="cinema-card cinema-card-hover group h-full flex flex-col">
        {/* Poster Image Container */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={tmdbApi.getImageUrl(movie.poster_path) || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={false}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 z-10">
            <div className="flex items-center bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-sm font-medium">
              <Star
                className={`h-3.5 w-3.5 mr-1 ${getRatingColor(
                  movie.vote_average
                )} fill-current`}
              />
              <span className={getRatingColor(movie.vote_average)}>
                {rating}
              </span>
            </div>
          </div>

          {/* New Badge */}
          {isNew() && (
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-black/70 text-yellow border-black/20 animate-pulse-slow">
                New
              </Badge>
            </div>
          )}

          {/* Hover Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <div className="flex items-center justify-between text-white text-sm mb-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-yellow-500" />
                <span>{releaseYear}</span>
              </div>
              {movie.popularity > 100 && (
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
                  <span>Popular</span>
                </div>
              )}
            </div>
            <p className="text-white/90 text-sm line-clamp-2">
              {movie.overview}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="font-bold text-base mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between mt-2 text-xs text-foreground/70">
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{movie.original_language.toUpperCase()}</span>
            </div>
            <div className="flex items-center">
              <Star className="h-3.5 w-3.5 mr-1 fill-yellow-500 text-yellow-500" />
              <span>{movie.vote_count} votes</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
