export interface WeatherResponse {
  temp?: number;
  temperature?: number;
  feelsLike?: number;
  humidity?: number;
  description?: string;
  condition?: string;
  city?: string;
  location?: string;

  [key: string]: unknown;
}
