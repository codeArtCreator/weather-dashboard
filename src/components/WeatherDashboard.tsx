import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { fetchWeather } from '../store/slices/weatherSlice';
import { RootState } from '../store/store';
import { Icon } from '@iconify/react';
import Loading from '../loading/loading';

const WeatherDashboard: React.FC = () => {
    const [city, setCity] = useState<string>('');
    const [unit, setUnit] = useState<string>('metric');
    const [weatherData, setWeatherData] = useState<any | null>(null);
    const dispatch = useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();
    const { loading, data, error } = useSelector((state: RootState) => state.weather);

    // Function to handle fetching weather data
    const fetchWeatherData = () => {
        try {
            if (city) {
                dispatch(fetchWeather(city));
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        if (data) {
            setWeatherData({
                temperature: data.main.temp,
                description: data.weather[0].description,
                humidity: data.main.humidity,
                feels_like: data.main.feels_like,
                temp_min: data.main.temp_min,
                temp_max: data.main.temp_max,
                pressure: data.main.pressure,
                windSpeed: data.wind.speed,
                icon: data.weather[0].icon,
            });
        }
    }, [data]);

    // Function to toggle temperature unit (Celsius/Fahrenheit)
    const toggleUnit = () => {
        setUnit(unit === 'metric' ? 'imperial' : 'metric');
    };

    // Function to convert Celsius to Fahrenheit
    const convertToCelsius = (temperature: number) => {
        const fahrenheit = (temperature * 9 / 5) + 32;
        return fahrenheit.toFixed(3);
    };

    // Handle "Enter" key press in the input field
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            fetchWeatherData();
        }
    };

    return (
        <div className="container">
            <div className='flex items-center justify-between mb-10'>
                <h1 className="text-3xl text-slate-600 font-bold">Weather Dashboard</h1>
                {weatherData &&
                    <a href='https://github.com/codeArtCreator/weather-dashboard' target='_blank'>
                        <Icon icon="fluent-mdl2:git-hub-logo" width="30" height="30" />
                    </a>
                }
            </div>

            <div className="flex flex-col p-2 py-6 m-h-screen">
                <div className="bg-white items-center justify-between w-full flex rounded-full shadow-lg p-2 mb-5 sticky" >
                    <input
                        className="font-bold uppercase rounded-full w-full py-4 pl-4 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline lg:text-sm text-xs"
                        type="text"
                        placeholder="Enter a city..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <div
                        className="bg-gray-600 p-2 hover:bg-blue-400 cursor-pointer mx-2 rounded-full"
                        onClick={fetchWeatherData}
                    >
                        <Icon icon="iconamoon:search-fill" color="#fff" width="24" height="24" />
                    </div>
                </div>
            </div>
            {loading && <Loading />}
            {error && <p>{error}</p>}
            {weatherData && (
                <div className='bg-white p-5 rounded-2xl'>
                    <div className='flex items-center justify-between'>
                        <h2 className="text-3xl my-4 text-gray-500">Current Weather</h2>
                        <div className="mb-4">
                            <select
                                value={unit}
                                onChange={toggleUnit}
                                className="border border-gray-300 rounded-md px-2 py-1"
                            >
                                <option value="metric">Celsius</option>
                                <option value="imperial">Fahrenheit</option>
                            </select>
                        </div>
                    </div>

                    {/* Display weather details */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-5'>
                        <div className=''>
                            <h3 className="text-2xl font-semibold mb-4 text-sky-900 ">{city.toUpperCase()}</h3>
                            <div className='flex items-center justify-center md:justify-start'>
                                <img
                                    src={`http://openweathermap.org/img/w/${weatherData.icon}.png`}
                                    alt="Weather Icon"
                                    className=""
                                />
                                <h1 className='text-4xl md:text-8xl ml-2 md:ml-5'>
                                    {unit === 'metric'
                                        ? `${weatherData.temperature} °C`
                                        : `${convertToCelsius(weatherData.temperature)} °F`
                                    }
                                </h1>
                            </div>
                            <h3 className="text-2xl text-gray-400 font-semibold my-5 ">{weatherData.description}</h3>
                        </div>

                        <div className=''>
                            <h3 className="text-l font-semibold mb-4 text-cyan-600">Feels like{' '}
                                <span className='text-l font-semibold text-blue-400 mx-2 md:mx-5'>
                                    {unit === 'metric'
                                        ? `${weatherData.feels_like} °C`
                                        : `${convertToCelsius(weatherData.feels_like)} °F`
                                    }
                                </span>
                            </h3>
                            <div className='flex items-center mb-4'>
                                <div className='flex items-center justify-between'>
                                    <Icon icon="mdi:arrow-up-bold" color="#9ca3af" width="24" height="24" />
                                    <span className='text-l font-semibold text-blue-400 mx-2 md:mx-5'>
                                        {unit === 'metric'
                                            ? `${weatherData.temp_max} °C`
                                            : `${convertToCelsius(weatherData.temp_max)} °F`
                                        }
                                    </span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <Icon icon="mdi:arrow-down-bold" color="#9ca3af" width="24" height="24" />
                                    <span className='text-l font-semibold text-blue-400 mx-2 md:mx-5'>
                                        {unit === 'metric'
                                            ? `${weatherData.temp_min} °C`
                                            : `${convertToCelsius(weatherData.temp_min)} °F`
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className='flex items-center mb-4'>
                                <Icon icon="material-symbols:humidity-high" color="#9ca3af" width="24" height="24" />
                                <h3 className="text-l text-gray-500 font-semibold ml-2 md:ml-5">Humidity</h3>
                                <h3 className="text-l font-semibold text-blue-400 ml-2 md:ml-5">{weatherData.humidity}%</h3>
                            </div>
                            <div className='flex items-center mb-4'>
                                <Icon icon="la:wind" color="#9ca3af" width="24" height="24" />
                                <h3 className="text-l text-gray-500 font-semibold ml-2 md:ml-5">Wind</h3>
                                <h3 className="text-l font-semibold text-blue-400 ml-2 md:ml-5"> {weatherData.windSpeed} kph</h3>
                            </div>
                            <div className='flex items-center'>
                                <Icon icon="mdi:car-brake-low-pressure" color="#9ca3af" width="24" height="24" />
                                <h3 className="text-l text-gray-500 font-semibold ml-2 md:ml-5">Pressure</h3>
                                <h3 className="text-l font-semibold text-blue-400 ml-2 md:ml-5"> {weatherData.pressure} hPa</h3>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherDashboard;
