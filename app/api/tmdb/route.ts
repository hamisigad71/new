import { NextResponse } from "next/server"

const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = "afc829bfacde4ae2aa545840a05b5f69"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get("endpoint")

  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint parameter" }, { status: 400 })
  }

  try {
    // Clean up the endpoint to ensure it starts with /
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`

    // Build the TMDB URL with the API key
    const separator = cleanEndpoint.includes("?") ? "&" : "?"
    const tmdbUrl = `${TMDB_BASE_URL}${cleanEndpoint}${separator}api_key=${API_KEY}`

    console.log("Making request to TMDB API...")

    // Make the request to TMDB with proper headers
    const response = await fetch(tmdbUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "MovieApp/1.0",
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    })

    console.log("TMDB Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("TMDB API error response:", errorText)

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = {
          error: `HTTP ${response.status}: ${response.statusText}`,
          raw_error: errorText,
        }
      }

      return NextResponse.json(errorData, { status: response.status })
    }

    // Parse and return the TMDB response
    const data = await response.json()
    console.log("TMDB request successful")

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("Failed to fetch from TMDB:", error)

    // Handle different types of errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          error: "Network error - unable to reach TMDB",
          debug: error.message,
        },
        { status: 503 },
      )
    } else if (error.name === "AbortError") {
      return NextResponse.json(
        {
          error: "Request timeout",
          debug: "Request took longer than 15 seconds",
        },
        { status: 408 },
      )
    } else {
      return NextResponse.json(
        {
          error: "Internal server error",
          debug: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
