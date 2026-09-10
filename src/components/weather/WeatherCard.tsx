import { useEffect, useState } from "react";

import {
  Cloud,
  CloudSun,
  Flame,
  MapPin,
  Snowflake,
  Sun,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import { getWeather } from "@/api/weatherApi";

import type { WeatherResponse } from "@/types/weather";


const WEATHER_CACHE_KEY = "journal_weather_cache";

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes


interface CachedWeather {
  data: WeatherResponse;
  timestamp: number;
}


type WeatherCache = Record<string, CachedWeather>;


// --------------------------------------------------
// Temperature icon
// --------------------------------------------------

function getTemperatureIcon(temp?: number) {
  if (temp === undefined) {
    return <CloudSun size={42} />;
  }

  if (temp < 10) {
    return <Snowflake size={42} />;
  }

  if (temp < 20) {
    return <Cloud size={42} />;
  }

  if (temp < 30) {
    return <CloudSun size={42} />;
  }

  if (temp < 40) {
    return <Sun size={42} />;
  }

  return <Flame size={42} />;
}


// --------------------------------------------------
// Dynamic weather background
// --------------------------------------------------

function getWeatherBackground(
  temp?: number,
  description?: string
) {
  const weatherText =
    (description || "").toLowerCase().trim();


  // ------------------------------------------------
  // 1. Thunderstorm / Storm
  // ------------------------------------------------

  if (
    weatherText.includes("thunder") ||
    weatherText.includes("storm")
  ) {
    return {
      image:
        "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1600&q=85",
      overlay:
        "from-black/20 via-black/30 to-black/60",
    };
  }


  // ------------------------------------------------
  // 2. Rain / Drizzle / Shower
  // ------------------------------------------------

  if (
    weatherText.includes("rain") ||
    weatherText.includes("drizzle") ||
    weatherText.includes("shower")
  ) {
    return {
      image:
        "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1600&q=85",
      overlay:
        "from-black/15 via-black/25 to-black/55",
    };
  }


  // ------------------------------------------------
  // 3. Snow
  // ------------------------------------------------

  if (
    weatherText.includes("snow") ||
    weatherText.includes("sleet") ||
    weatherText.includes("blizzard")
  ) {
    return {
      image:
        "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1600&q=85",
      overlay:
        "from-black/10 via-black/15 to-black/40",
    };
  }


  // ------------------------------------------------
  // 4. Fog / Mist / Haze
  // ------------------------------------------------

  if (
    weatherText.includes("fog") ||
    weatherText.includes("mist") ||
    weatherText.includes("haze")
  ) {
    return {
      image:
        "https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=1600&q=85",
      overlay:
        "from-black/10 via-black/20 to-black/45",
    };
  }


  // ------------------------------------------------
  // 5. Cloudy / Overcast
  // ------------------------------------------------

  if (
    weatherText.includes("cloud") ||
    weatherText.includes("overcast")
  ) {
    return {
      image:
        "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1600&q=85",
      overlay:
        "from-black/10 via-black/20 to-black/45",
    };
  }


  // ------------------------------------------------
  // 6. Temperature based backgrounds
  //
  // These are used when the condition is clear,
  // sunny, or unavailable.
  // ------------------------------------------------

  if (temp !== undefined) {

    // Very cold
    if (temp < 10) {
      return {
        image:
          "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1600&q=85",
        overlay:
          "from-black/10 via-black/15 to-black/40",
      };
    }


    // Cool
    if (temp < 20) {
      return {
        image:
          "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=85",
        overlay:
          "from-black/10 via-black/20 to-black/45",
      };
    }


    // Pleasant
    if (temp < 30) {
      return {
        image:
          "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1600&q=85",
        overlay:
          "from-black/10 via-black/20 to-black/40",
      };
    }


    // Hot
    if (temp < 40) {
      return {
        image:
          "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=85",
        overlay:
          "from-black/10 via-black/20 to-black/45",
      };
    }


    // Extremely hot
    return {
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85",
      overlay:
        "from-black/15 via-black/25 to-black/55",
    };
  }


  // ------------------------------------------------
  // Default
  // ------------------------------------------------

  return {
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1600&q=85",
    overlay:
      "from-black/10 via-black/20 to-black/40",
  };
}


// --------------------------------------------------
// localStorage helpers
// --------------------------------------------------

function getWeatherCache(): WeatherCache {
  try {
    const stored =
      localStorage.getItem(
        WEATHER_CACHE_KEY
      );

    if (!stored) {
      return {};
    }

    return JSON.parse(
      stored
    ) as WeatherCache;

  } catch {
    return {};
  }
}


function saveWeatherCache(
  cache: WeatherCache
) {
  try {
    localStorage.setItem(
      WEATHER_CACHE_KEY,
      JSON.stringify(cache)
    );
  } catch {
    // Ignore localStorage errors
  }
}


// --------------------------------------------------
// Weather Card
// --------------------------------------------------

export default function WeatherCard() {
  const [weather, setWeather] =
    useState<WeatherResponse | null>(
      null
    );

    const { user } = useAuth();

  const [city, setCity] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

    useEffect(() => {
    if (!user) {
    setCity('');
    setWeather(null);
    setError('');
    localStorage.removeItem(WEATHER_CACHE_KEY);
  }
}, [user]);

  // --------------------------------------------------
  // Restore latest cached weather
  // --------------------------------------------------

  useEffect(() => {
    const cache =
      getWeatherCache();

    const cachedCities =
      Object.keys(cache);

    if (
      cachedCities.length === 0
    ) {
      return;
    }

    const latestCity =
      cachedCities.reduce(
        (latest, current) => {
          return cache[current]
            .timestamp >
            cache[latest]
              .timestamp
            ? current
            : latest;
        }
      );

    const cached =
      cache[latestCity];

    if (
      Date.now() -
        cached.timestamp <
      CACHE_DURATION
    ) {
      setWeather(
        cached.data
      );

      setCity(
        cached.data.city ||
          latestCity
      );
    }
  }, []);


  // --------------------------------------------------
  // Search weather
  // --------------------------------------------------

  async function fetchWeather() {
    const trimmedCity =
      city.trim();

    if (!trimmedCity) {
      return;
    }

    const cacheKey =
      trimmedCity.toLowerCase();

    const cache =
      getWeatherCache();

    const cached =
      cache[cacheKey];


    // ------------------------------------------------
    // Use cache if still valid
    // ------------------------------------------------

    if (
      cached &&
      Date.now() -
        cached.timestamp <
        CACHE_DURATION
    ) {
      console.log(
        "Using cached weather for:",
        trimmedCity
      );

      setWeather(
        cached.data
      );

      setError("");

      return;
    }


    // ------------------------------------------------
    // Call backend
    // ------------------------------------------------

    try {
      setLoading(true);

      setError("");

      const data =
        await getWeather(
          trimmedCity
        );

      console.log(
        "Weather response:",
        data
      );

      setWeather(data);


      // ------------------------------------------------
      // Save weather in cache
      // ------------------------------------------------

      cache[cacheKey] = {
        data,
        timestamp:
          Date.now(),
      };

      saveWeatherCache(
        cache
      );

    } catch (err) {
      console.error(
        "Weather error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Weather request failed"
      );

      setWeather(null);

    } finally {
      setLoading(false);
    }
  }


  // --------------------------------------------------
  // Weather values
  // --------------------------------------------------

  const temp =
    weather?.temp ??
    weather?.temperature;

  const feelsLike =
    weather?.feelsLike;

  const description =
    weather?.description ||
    weather?.condition;

  const weatherCity =
    weather?.city ||
    weather?.location ||
    city;


  // --------------------------------------------------
  // Dynamic background
  // --------------------------------------------------

  const weatherBackground =
    weather
      ? getWeatherBackground(
          temp,
          description
        )
      : null;


  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        shadow-lg
        min-h-[320px]
        bg-card
        bg-cover
        bg-center
        transition-all
        duration-700
      "
      style={
        weatherBackground
          ? {
              backgroundImage:
                `url("${weatherBackground.image}")`,
            }
          : undefined
      }
    >

      {/* -------------------------------------------- */}
      {/* Weather overlay */}
      {/* -------------------------------------------- */}

      {weatherBackground && (
        <div
          className={`
            absolute
            inset-0
            bg-gradient-to-br
            ${weatherBackground.overlay}
            transition-all
            duration-700
          `}
        />
      )}


      {/* -------------------------------------------- */}
      {/* Content */}
      {/* -------------------------------------------- */}

      <div
        className={`
          relative
          z-10
          h-full
          min-h-[320px]
          p-5
          ${
            weather
              ? "text-white"
              : "bg-card"
          }
        `}
      >

        {/* ------------------------------------------ */}
        {/* Header */}
        {/* ------------------------------------------ */}

        <div
          className="
            flex
            items-center
            gap-2
            mb-4
          "
        >

          <CloudSun
            size={18}
            className={
              weather
                ? "text-white"
                : "text-journalAccent"
            }
          />

          <h2
            className={`
              text-sm
              font-semibold
              ${
                weather
                  ? "text-white"
                  : "text-ink"
              }
            `}
          >
            Weather
          </h2>

        </div>


        {/* ------------------------------------------ */}
        {/* City Search */}
        {/* ------------------------------------------ */}

        <div
          className="
            flex
            gap-2
            mb-5
          "
        >

          <input
            type="text"
            value={city}
            onChange={(e) =>
              setCity(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter"
              ) {
                fetchWeather();
              }
            }}
            placeholder="Enter your city"
            className="
              flex-1
              px-3
              py-2
              text-sm
              border
              border-white/30
              rounded-lg
              bg-black/20
              backdrop-blur-md
              text-white
              placeholder:text-white/70
              outline-none
              focus:border-white/60
              transition
            "
          />

          <button
            type="button"
            onClick={
              fetchWeather
            }
            disabled={
              loading ||
              !city.trim()
            }
            className="
              px-4
              py-2
              text-sm
              font-medium
              rounded-lg
              bg-primary
              text-white
              disabled:opacity-50
              transition
              hover:opacity-90
              shadow-sm
            "
          >
            {loading
              ? "Loading..."
              : "Search"}
          </button>

        </div>


        {/* ------------------------------------------ */}
        {/* Loading */}
        {/* ------------------------------------------ */}

        {loading && (
          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              py-8
            "
          >

            <div
              className="
                w-4
                h-4
                border-2
                border-white/30
                border-t-white
                rounded-full
                animate-spin
              "
            />

            <span
              className="
                text-sm
                text-white
              "
            >
              Loading weather...
            </span>

          </div>
        )}


        {/* ------------------------------------------ */}
        {/* Error */}
        {/* ------------------------------------------ */}

        {!loading &&
          error && (
            <div
              className="
                p-4
                rounded-xl
                bg-white/10
                backdrop-blur-md
                border
                border-white/20
              "
            >

              <p
                className="
                  text-sm
                  text-white
                "
              >
                Weather unavailable.
              </p>

              <p
                className="
                  text-xs
                  text-white/70
                  mt-1
                "
              >
                {error}
              </p>

            </div>
          )}


        {/* ------------------------------------------ */}
        {/* Weather Result */}
        {/* ------------------------------------------ */}

        {!loading &&
          !error &&
          weather && (

            <div
              className="
                mt-2
                transition-all
                duration-500
              "
            >

              {/* Temperature */}

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-16
                    h-16
                    rounded-full
                    bg-white/20
                    border
                    border-white/20
                    backdrop-blur-md
                    shadow-lg
                  "
                >
                  {getTemperatureIcon(
                    temp
                  )}
                </div>


                <div>

                  {temp !==
                    undefined && (
                    <p
                      className="
                        text-4xl
                        font-semibold
                        text-white
                        leading-none
                        drop-shadow-sm
                      "
                    >
                      {temp.toFixed(
                        2
                      )}°C
                    </p>
                  )}

                  {feelsLike !==
                    undefined && (
                    <p
                      className="
                        text-base
                        text-white/85
                        mt-2
                      "
                    >
                      Feels like{" "}
                      {feelsLike.toFixed(
                        2
                      )}°C
                    </p>
                  )}

                </div>

              </div>


              {/* Description */}

              {description && (
                <div
                  className="
                    mt-4
                  "
                >

                  <span
                    className="
                      inline-flex
                      items-center
                      px-3
                      py-1.5
                      rounded-full
                      bg-white/20
                      border
                      border-white/20
                      backdrop-blur-md
                      text-sm
                      text-white
                      shadow-sm
                    "
                  >
                    {description}
                  </span>

                </div>
              )}


              {/* Location */}

              {weatherCity && (
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mt-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      w-9
                      h-9
                      rounded-full
                      bg-white/20
                      border
                      border-white/20
                      backdrop-blur-md
                    "
                  >

                    <MapPin
                      size={17}
                      className="text-white"
                    />

                  </div>

                  <span
                    className="
                      text-sm
                      font-medium
                      text-white
                      drop-shadow-sm
                    "
                  >
                    {weatherCity}
                  </span>

                </div>
              )}

            </div>
          )}


        {/* ------------------------------------------ */}
        {/* Initial State */}
        {/* ------------------------------------------ */}

        {!loading &&
          !error &&
          !weather && (

            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                py-6
                text-center
              "
            >

              <CloudSun
                size={40}
                className="
                  text-journalAccent
                  mb-2
                "
              />

              <p
                className="
                  text-sm
                  text-ink-muted
                "
              >
                Enter a city to see the weather.
              </p>

            </div>
          )}

      </div>

    </div>
  );
}

