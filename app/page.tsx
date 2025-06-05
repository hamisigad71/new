"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
import Link from "next/link";
import { MovieGrid } from "@/components/movies/movie-grid";
import { Pagination } from "@/components/movies/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { type Movie, type MoviesResponse, tmdbApi } from "@/lib/tmdb";
import {
  Loader2,
  TrendingUp,
  Award,
  Clock,
  Play,
  Star,
  Film,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("popular");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  const fetchMovies = async (type: string, page = 1) => {
    if (!user) return; // Don't fetch if not authenticated

    setLoading(true);
    setError(null);

    try {
      let response: MoviesResponse;

      switch (type) {
        case "popular":
          response = await tmdbApi.getPopularMovies(page);
          setPopularMovies(response.results);
          break;
        case "top-rated":
          response = await tmdbApi.getTopRatedMovies(page);
          setTopRatedMovies(response.results);
          break;
        case "now-playing":
          response = await tmdbApi.getNowPlayingMovies(page);
          setNowPlayingMovies(response.results);
          break;
        default:
          response = await tmdbApi.getPopularMovies(page);
          setPopularMovies(response.results);
      }

      setTotalPages(Math.min(response.total_pages, 500)); // TMDB API limit
      setCurrentPage(page);

      // Show success message on first load
      if (page === 1 && response.results.length > 0) {
        toast({
          title: "Success!",
          description: `Loaded ${response.results.length} movies`,
        });
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch movies";
      setError(errorMessage);

      // Set empty arrays to prevent undefined errors
      if (type === "popular") setPopularMovies([]);
      if (type === "top-rated") setTopRatedMovies([]);
      if (type === "now-playing") setNowPlayingMovies([]);

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to fetch movies. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMovies("popular");
    }
  }, [user]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    fetchMovies(value, 1);
  };

  const handlePageChange = (page: number) => {
    fetchMovies(activeTab, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetry = () => {
    fetchMovies(activeTab, currentPage);
  };

  // Show loading state while checking authentication or if user is not yet available
  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <Loader2 className="h-16 w-16 animate-spin text-primary absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Film className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (
    loading &&
    popularMovies.length === 0 &&
    topRatedMovies.length === 0 &&
    nowPlayingMovies.length === 0
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <Loader2 className="h-16 w-16 animate-spin text-primary absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Film className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <p className="text-muted-foreground">Loading movies...</p>
        </div>
      </div>
    );
  }

  if (
    error &&
    popularMovies.length === 0 &&
    topRatedMovies.length === 0 &&
    nowPlayingMovies.length === 0
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <AlertCircle className="h-16 w-16 text-primary mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">
            Unable to Load Movies
          </h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={handleRetry} className="btn-professional">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const getCurrentMovies = () => {
    switch (activeTab) {
      case "popular":
        return popularMovies;
      case "top-rated":
        return topRatedMovies;
      case "now-playing":
        return nowPlayingMovies;
      default:
        return popularMovies;
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "popular":
        return <TrendingUp className="h-4 w-4 mr-2" />;
      case "top-rated":
        return <Award className="h-4 w-4 mr-2" />;
      case "now-playing":
        return <Clock className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const featuredMovie =
    popularMovies.find((movie) => movie.backdrop_path) || popularMovies[0];

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0      opacity-5 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/streaming-bg.jpg')",
        }}
      />
      <div className="relative z-10 bg-background/95">
        {featuredMovie && (
          <section className="relative h-[60vh] md:h-[70vh] overflow-hidden bg-muted/30">
            <div className="absolute inset-0">
              <Image
                src={
                  tmdbApi.getBackdropUrl(
                    featuredMovie.backdrop_path,
                    "original"
                  ) || "/placeholder.svg"
                }
                alt={featuredMovie.title}
                fill
                className="object-cover object-center"
                priority
                quality={90}
                sizes="100vw"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
            </div>

            <div className="container relative z-10 h-full flex flex-col justify-center md:justify-end pb-8 md:pb-16 px-4">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in text-white drop-shadow-lg">
                  {featuredMovie.title}
                </h1>

                <div className="flex items-center space-x-4 mb-4 animate-fade-in">
                  <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-3 py-1 border border-white/30">
                    <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                    <span className="font-medium text-white text-sm">
                      {featuredMovie.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-3 py-1 border border-white/30">
                    <Calendar className="h-4 w-4 mr-1 text-white/80" />
                    <span className="text-white text-sm">
                      {new Date(featuredMovie.release_date).getFullYear()}
                    </span>
                  </div>
                </div>

                <p className="text-base text-white/90 mb-6 line-clamp-3 animate-fade-in max-w-xl leading-relaxed drop-shadow-md">
                  {featuredMovie.overview}
                </p>

                <div className="flex flex-wrap gap-3 animate-fade-in">
                  <Link href={`/movie/${featuredMovie.id}`}>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                      <Play className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/movie/${featuredMovie.id}`}>
                    <Button
                      variant="outline"
                      className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 py-12">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
                  Browse Movies
                </h2>
                <p className="text-muted-foreground">
                  Discover your next favorite film
                </p>
              </div>
              <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:grid-cols-3 mt-4 sm:mt-0 bg-muted/50">
                <TabsTrigger
                  value="popular"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {getTabIcon("popular")}
                  Popular
                </TabsTrigger>
                <TabsTrigger
                  value="top-rated"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {getTabIcon("top-rated")}
                  Top Rated
                </TabsTrigger>
                <TabsTrigger
                  value="now-playing"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {getTabIcon("now-playing")}
                  Now Playing
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="animate-fade-in">
              <MovieGrid movies={getCurrentMovies()} loading={loading} />

              {error && !loading && getCurrentMovies().length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    className="btn-professional-outline"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {!loading && getCurrentMovies().length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChangeAction={handlePageChange}
                />
              )}
            </div>
          </Tabs>
        </section>
      </div>
    </div>
  );
}
