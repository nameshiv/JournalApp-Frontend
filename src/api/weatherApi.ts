import client from './client';

import type { WeatherResponse } from '@/types/weather';

export async function getWeather(city: string): Promise<WeatherResponse> {
  const res = await client.get('/user/weather', {
    params: { city },
  });

  const data = res.data;


  if (typeof data === 'string') {
    const match = data.match(
      /Temperature in (.+?) is ([\d.-]+).*?Weather feels like ([\d.-]+)/i
    );

    if (match) {
      return {
        city: match[1],
        temp: Number(match[2]),
        feelsLike: Number(match[3]),
      };
    }

    return {
      description: data,
    };
  }

  return data as WeatherResponse;
}

