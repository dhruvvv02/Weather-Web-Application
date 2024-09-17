
import { useContext, createContext, useState, useEffect, useCallback } from "react";
import axios from 'axios'

const StateContext = createContext()



export const StateContextProvider = ({children}) => {
    const [weather, setWeather] = useState({})

    const [values, setValues] = useState([])

    const [dailyForecast, setDailyForecast] = useState([])

    const [place, setPlace] = useState(() => {
        return localStorage.getItem('lastPlace') || 'New York'
    })

    const [thisLocation, setLocation] = useState('')

    const [loading, setLoading] = useState(false)

    const calHeatIndex = (temperature, humidity) => {
        return temperature - ((0.55 - 0.0055 * humidity) * (temperature - 14.5))
    }


    //fetch api
    const fetchWeather = useCallback(async() => {
        const apiKey = process.env.REACT_APP_API_KEY
        const city = place
        const units = 'metric'

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`

        setLoading(true)

        try {

            const response = await axios.get(url);
            const data = response.data

            const temperature = data.main.temp
            const humidity = data.main.humidity
            const heatIndex = calHeatIndex(temperature, humidity)
            
            setLocation(data.name)
            setWeather({
                temp: data.main.temp,
                humidity: data.main.humidity,
                windspeed: data.wind.speed,
                conditions: data.weather[0].description,
                heatIndex : heatIndex.toFixed(2)

            })

            setValues([])
            fetchForecast(city)
            setLoading(false)

        } catch (e) {

            console.error(e);
            //if the api throws error

            alert('This place dost not exist')
            setLoading(false)
        }
    },[place])

    const fetchForecast = async (city) => {
        const apiKey = process.env.REACT_APP_API_KEY;
        const units = 'metric';
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;

        try {
            const response = await axios.get(url);
            const data = response.data;

            // Extract daily forecast for the next 5 days
            const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
            setDailyForecast(dailyData.slice(0, 5)); // Use only the first 5 days

        } catch (e) {
            console.error(e);
            alert('Unable to fetch forecast data');
        }
    };

    useEffect(() => {

        fetchWeather()

    },[fetchWeather])

    useEffect(() => {
        localStorage.setItem('lastPlace', place)
    },[place])

    return(

        <StateContext.Provider value={{
            weather,
            setPlace,
            values,
            dailyForecast,
            thisLocation,
            place,
            loading

        }}>

            {children}

        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)