import Link from "next/link"
import { Film, Github, Twitter, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/20 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Film className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">CinemaHub</span>
            </Link>
            <p className="text-sm text-foreground/70">
              Discover amazing movies from around the world with our modern, cinematic movie recommendation platform.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/top-rated" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Top Rated
                </Link>
              </li>
              <li>
                <Link href="/upcoming" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Upcoming
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-foreground/60">
            &copy; {new Date().getFullYear()} CinemaHub. All rights reserved.
          </p>
          <p className="text-sm text-foreground/60 flex items-center mt-4 md:mt-0">
            Made by Daysmangad <Heart className="h-4 w-4 text-primary mx-1" /> using Next.js and TMDB API
          </p>
        </div>
      </div>
    </footer>
  )
}
