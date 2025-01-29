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
    };
    wind_kph: number;
    humidity: number;
    feelslike_c: number;
  };
}

export interface LocationSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
}

export interface StoredLocation {
  id: number;
  name: string;
  region: string;
  country: string;
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