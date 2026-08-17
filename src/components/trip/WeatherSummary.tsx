import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { 
  CloudIcon, 
  SunIcon, 
  CalendarIcon,
  BoltIcon,
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useTripStore } from '../../stores/tripStore';
import { tripService } from '../../services/tripService';

interface WeatherSummaryProps {
  onClick?: () => void;
  location?: string;
  time?: string;
  className?: string;
}

const UmbrellaIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={className} viewBox="0 0 16 16">
    <path d="M8 0a.5.5 0 0 1 .5.5v.514C12.625 1.238 16 4.22 16 8c0 0 0 .5-.5.5-.149 0-.352-.145-.352-.145l-.004-.004-.025-.023a3.5 3.5 0 0 0-.555-.394A3.17 3.17 0 0 0 13 7.5c-.638 0-1.178.213-1.564.434a3.5 3.5 0 0 0-.555.394l-.025.023-.003.003s-.204.146-.353.146-.352-.145-.352-.145l-.004-.004-.025-.023a3.5 3.5 0 0 0-.555-.394 3.3 3.3 0 0 0-1.064-.39V13.5H8h.5v.039l-.005.083a3 3 0 0 1-.298 1.102 2.26 2.26 0 0 1-.763.88C7.06 15.851 6.587 16 6 16s-1.061-.148-1.434-.396a2.26 2.26 0 0 1-.763-.88 3 3 0 0 1-.302-1.185v-.025l-.001-.009v-.003s0-.002.5-.002h-.5V13a.5.5 0 0 1 1 0v.506l.003.044a2 2 0 0 0 .195.726c.095.191.23.367.423.495.19.127.466.229.879.229s.689-.102.879-.229c.193-.128.328-.304.424-.495a2 2 0 0 0 .197-.77V7.544a3.3 3.3 0 0 0-1.064.39 3.5 3.5 0 0 0-.58.417l-.004.004S5.65 8.5 5.5 8.5s-.352-.145-.352-.145l-.004-.004a3.5 3.5 0 0 0-.58-.417A3.17 3.17 0 0 0 3 7.5c-.638 0-1.177.213-1.564.434a3.5 3.5 0 0 0-.58.417l-.004.004S.65 8.5.5 8.5C0 8.5 0 8 0 8c0-3.78 3.375-6.762 7.5-6.986V.5A.5.5 0 0 1 8 0M6.577 2.123c-2.833.5-4.99 2.458-5.474 4.854A4.1 4.1 0 0 1 3 6.5c.806 0 1.48.25 1.962.511a9.7 9.7 0 0 1 .344-2.358c.242-.868.64-1.765 1.271-2.53m-.615 4.93A4.16 4.16 0 0 1 8 6.5a4.16 4.16 0 0 1 2.038.553 8.7 8.7 0 0 0-.307-2.13C9.434 3.858 8.898 2.83 8 2.117c-.898.712-1.434 1.74-1.731 2.804a8.7 8.7 0 0 0-.307 2.131zm3.46-4.93c.631.765 1.03 1.662 1.272 2.53.233.833.328 1.66.344 2.358A4.14 4.14 0 0 1 13 6.5c.77 0 1.42.23 1.897.477-.484-2.396-2.641-4.355-5.474-4.854z" />
  </svg>
);

const getWeatherIcon = (condition: string, className = "h-6 w-6") => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
    return <SunIcon className={`${className} text-amber-500`} />;
  } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
    return <UmbrellaIcon className={`${className} text-blue-500`} />;
  } else if (lowerCondition.includes('storm')) {
    return <BoltIcon className={`${className} text-purple-500`} />;
  } else {
    return <CloudIcon className={`${className} text-gray-400`} />;
  }
};

const WeatherSummary: React.FC<WeatherSummaryProps> = ({ 
  onClick, 
  location: propLocation, 
  time: propTime,
  className = ""
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const { currentTrip } = useTripStore();
  
  const location = propLocation || currentTrip?.settings.destination || 'Copenhagen';
  const time = propTime;
  const queryKey = time ? ['weather', location, time] : ['weather', location];

  const { data: weather, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const realtimeWeather = await tripService.getWeatherData(location);
      let forecast = realtimeWeather.forecast;
      
      if (!forecast || forecast.length === 0) {
          forecast = Array.from({ length: 3 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i + 1);
          return {
            date: date.toISOString().split('T')[0],
            temp: realtimeWeather.temperature + (i % 2 === 0 ? 1 : -2), 
            condition: i === 1 ? 'Cloudy' : realtimeWeather.condition,
          };
        });
      }
      return { ...realtimeWeather, forecast };
    },
    enabled: !!location,
    staleTime: 1000 * 60 * 30,
  });

  const currentDate = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' });

  if (isLoading || !weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative z-50 ${className}`}
      onClick={onClick}
    >
      {/* 
        Card Container:
        - Solid White (or very slight transparency)
        - Clean shadow
        - Ring for subtle border
      */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-xl ring-1 ring-black/5 w-auto md:w-64 select-none">
        
        {/* Header: Date */}
        <div className="hidden md:flex items-center gap-2 mb-4 text-gray-400">
          <CalendarIcon className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{currentDate}</span>
        </div>

        {/* Main: Temp & Condition */}
        <div className="flex items-center md:items-start justify-between gap-4 md:gap-0 md:mb-6">
          <div className="flex flex-col">
            <span className="font-sans text-3xl md:text-5xl font-bold text-gray-900 tracking-tight leading-none">
              {Math.round(weather.temperature)}°
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-1">
             <div className="p-2 bg-gray-50 rounded-2xl">
                {getWeatherIcon(weather.condition, "w-6 h-6 md:w-8 md:h-8")}
             </div>
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{weather.condition}</span>
          </div>
        </div>

        {/* Desktop Details */}
        <div className="hidden md:block">
          
          <div className="mb-5">
            <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Forecast</h4>
            <div className="space-y-3">
              {weather.forecast.slice(0, 3).map((day, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    {getWeatherIcon(day.condition, "w-4 h-4")}
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                      {Math.round(day.temp)}°
                    </span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-teal-500' : 'bg-gray-200'}`} />
                </div>
              ))}
            </div>
          </div>

          <div>
             <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Essentials</h4>
             <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.2 4.8l-2.4 2.4-2.8-2.8 2.4-2.4c.8-.8 2-.8 2.8 0 .8.8.8 2 0 2.8zM4 20v-6h2.5l-2.5-3.5V8c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v2.5L15.5 14H18v6c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2z"/>
                  </svg>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                   <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                   </svg>
                </div>
                {weather.condition.toLowerCase().includes('rain') && (
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <UmbrellaIcon className="w-4 h-4" />
                  </div>
                )}
             </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default WeatherSummary;