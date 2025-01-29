export interface WeatherResponse {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    humidity: number;
    feelslike_c: number;
  };
}

export interface LocationSuggestion {
  id: string;
  name: string;
  region: string;
  country: string;
}

export interface StoredLocation extends LocationSuggestion {
  timestamp?: number;
  weather?: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    localtime: string;
  };
}

export interface WeatherError {
  status: number;
  message: string;
} 