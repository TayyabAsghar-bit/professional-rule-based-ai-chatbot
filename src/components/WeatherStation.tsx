import React, { useState, useEffect } from "react";
import { CloudSun, Search, MapPin, Compass, Wind, Droplets, Sun, CloudRain, CloudSnow, CloudLightning, HelpCircle } from "lucide-react";

interface WeatherData {
  city: string;
  temp: number;
  condition: "Sunny" | "Cloudy" | "Rainy" | "Stormy" | "Snowy";
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  forecast: { day: string; temp: number; condition: string }[];
}

export default function WeatherStation() {
  const [cityInput, setCityInput] = useState("");
  const [currentCity, setCurrentCity] = useState("New York");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const defaultCities = ["New York", "Tokyo", "London", "Sydney", "Paris", "Cairo", "Moscow"];

  // Simple deterministic hash based on a string to generate reproducible fake weather
  const generateWeatherForCity = (cityName: string): WeatherData => {
    const formattedName = cityName.trim();
    if (!formattedName) return generateWeatherForCity("New York");

    let hash = 0;
    for (let i = 0; i < formattedName.length; i++) {
      hash = formattedName.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);

    // Weather condition
    const conditions: WeatherData["condition"][] = ["Sunny", "Cloudy", "Rainy", "Stormy", "Snowy"];
    const condition = conditions[hash % conditions.length];

    // Temp range based on condition
    let baseTemp = 20; // celsius
    if (condition === "Sunny") baseTemp = 26 + (hash % 10);
    else if (condition === "Cloudy") baseTemp = 16 + (hash % 8);
    else if (condition === "Rainy") baseTemp = 12 + (hash % 6);
    else if (condition === "Stormy") baseTemp = 14 + (hash % 8);
    else if (condition === "Snowy") baseTemp = -8 + (hash % 10);

    const humidity = 40 + (hash % 50); // 40% - 90%
    const windSpeed = 5 + (hash % 25); // 5 - 30 km/h
    const uvIndex = condition === "Sunny" ? 6 + (hash % 5) : 1 + (hash % 4);

    // Generate 3-day forecast
    const days = ["Tomorrow", "In 2 Days", "In 3 Days"];
    const forecast = days.map((day, idx) => {
      const dayHash = hash + idx + 1;
      const fCondition = conditions[dayHash % conditions.length];
      let fTemp = baseTemp + (dayHash % 6) - 3;
      if (fCondition === "Snowy" && fTemp > 0) fTemp = -2;
      return {
        day,
        temp: Math.round(fTemp),
        condition: fCondition,
      };
    });

    return {
      city: formattedName,
      temp: Math.round(baseTemp),
      condition,
      humidity,
      windSpeed,
      uvIndex,
      forecast,
    };
  };

  useEffect(() => {
    setWeather(generateWeatherForCity(currentCity));
  }, [currentCity]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setCurrentCity(cityInput);
      setCityInput("");
    }
  };

  const getWeatherIcon = (cond: string, size = 24) => {
    switch (cond) {
      case "Sunny":
        return <Sun size={size} className="text-amber-400 animate-pulse" />;
      case "Cloudy":
        return <CloudSun size={size} className="text-slate-300" />;
      case "Rainy":
        return <CloudRain size={size} className="text-blue-400" />;
      case "Stormy":
        return <CloudLightning size={size} className="text-purple-400" />;
      case "Snowy":
        return <CloudSnow size={size} className="text-cyan-200" />;
      default:
        return <HelpCircle size={size} className="text-slate-400" />;
    }
  };

  const getConditionColor = (cond: string) => {
    switch (cond) {
      case "Sunny":
        return "from-amber-500/10 to-orange-500/5 border-amber-500/20";
      case "Cloudy":
        return "from-slate-500/10 to-blue-500/5 border-slate-500/20";
      case "Rainy":
        return "from-blue-500/10 to-indigo-500/5 border-blue-500/20";
      case "Stormy":
        return "from-purple-500/10 to-pink-500/5 border-purple-500/20";
      case "Snowy":
        return "from-cyan-400/10 to-blue-300/5 border-cyan-400/20";
      default:
        return "from-slate-500/10 to-slate-500/5 border-slate-500/20";
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-full w-full bg-[#0F172A] p-4 md:p-8 overflow-y-auto select-text">
      <div className="max-w-xl mx-auto w-full space-y-6">
        
        {/* Search header */}
        <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-4 md:p-6 shadow-xl space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Search city (e.g., London, Sydney, Toronto)..."
              className="w-full bg-[#0F172A] border border-white/10 focus:border-blue-500/50 rounded-xl py-3.5 pl-11 pr-24 text-sm text-white focus:outline-none transition-all placeholder:text-slate-500"
            />
            <Search className="absolute left-4 top-4 text-slate-500" size={16} />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-xs font-bold transition-all text-white cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Quick recommendations */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mr-1">Hotspots:</span>
            {defaultCities.map((c) => (
              <button
                key={c}
                onClick={() => setCurrentCity(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  currentCity.toLowerCase() === c.toLowerCase()
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-[#0F172A]/50 border border-transparent hover:border-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {weather && (
          <div className={`bg-gradient-to-br ${getConditionColor(weather.condition)} border rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 transition-all duration-300`}>
            {/* Primary city stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                  {getWeatherIcon(weather.condition, 44)}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5 text-white font-bold text-2xl leading-none">
                    <MapPin size={18} className="text-slate-400" />
                    <span>{weather.city}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{weather.condition} Conditions</p>
                </div>
              </div>
              
              {/* Temperature display */}
              <div className="flex items-baseline font-mono text-white select-none">
                <span className="text-5xl md:text-6xl font-bold tracking-tighter">{weather.temp}</span>
                <span className="text-2xl font-light text-blue-400 ml-1">°C</span>
                <span className="text-sm text-slate-500 ml-3 font-sans">/ {Math.round((weather.temp * 9) / 5 + 32)}°F</span>
              </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-black/10 border border-white/5 rounded-xl p-4 text-center">
                <Droplets size={16} className="text-blue-400 mx-auto mb-2" />
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Humidity</span>
                <span className="block text-sm font-bold text-white mt-1 font-mono">{weather.humidity}%</span>
              </div>
              <div className="bg-black/10 border border-white/5 rounded-xl p-4 text-center">
                <Wind size={16} className="text-teal-400 mx-auto mb-2" />
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Wind Speed</span>
                <span className="block text-sm font-bold text-white mt-1 font-mono">{weather.windSpeed} km/h</span>
              </div>
              <div className="bg-black/10 border border-white/5 rounded-xl p-4 text-center">
                <Sun size={16} className="text-amber-400 mx-auto mb-2" />
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">UV Index</span>
                <span className="block text-sm font-bold text-white mt-1 font-mono">{weather.uvIndex} / 11</span>
              </div>
            </div>

            {/* 3 Day forecast */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">3-Day Forecast</h3>
              <div className="divide-y divide-white/5 bg-black/10 border border-white/5 rounded-xl overflow-hidden">
                {weather.forecast.map((fc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 transition hover:bg-white/5">
                    <span className="text-xs text-slate-300 font-medium w-24">{fc.day}</span>
                    <div className="flex items-center space-x-2 flex-1 justify-center md:justify-start">
                      {getWeatherIcon(fc.condition, 16)}
                      <span className="text-xs text-slate-400">{fc.condition}</span>
                    </div>
                    <span className="text-xs text-white font-mono font-bold">{fc.temp}°C / {Math.round((fc.temp * 9) / 5 + 32)}°F</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Note info */}
        <div className="flex items-start space-x-2 text-slate-500 text-[10px] bg-black/10 border border-white/5 p-4 rounded-xl leading-relaxed">
          <Compass size={14} className="mt-0.5 text-slate-400 shrink-0" />
          <p>
            This Weather Station runs a deterministic algorithm based on standard string-based hash seeding. Every city generates its own consistent climatic values, demonstrating offline micro-computation without loading heavy external trackers.
          </p>
        </div>

      </div>
    </div>
  );
}
