import {useState} from 'react'  
import './App.css'

import search from './assets/icons/search.svg'
import { useStateContext } from './Context'
import BackgroundLayout from './Components/BackgroundLayout'
import WeatherCard from './Components/WeatherCard'
import MiniCard from './Components/MiniCard'


function App() {

  const [input, setInput] = useState('')

  const {weather, thisLocation, dailyForecast, values, place, setPlace, loading} = useStateContext()

  console.log(weather)

  const submitCity = () => {
    setPlace(input)
    setInput('')
  }

  return (
    <div className='w-full h-screen text-white px-8'>

      <nav className='w-full p-3 flex justify-between items-center'>

        <h1 className='font-bold tracking-wide text-3xl'>Weather Dashboard</h1>

        <div className='bg-white w-[15rem] overflow-hidden shadow-2xl rounded flex items-center p-2 gap-2'>

          <img src={search} alt='search' className='w-[1.5rem] h-[1.5rem]'/>

          <input onKeyUp={(e) => {
            if(e.key === 'Enter'){
              //submit the form
              submitCity()
            }
          }} type='text' placeholder='Search City' className='focus:outline-none w-full text-[#212121] text-lg' value={input} onChange={e => setInput(e.target.value)}/>


        </div>

      </nav>

      <BackgroundLayout/>
      <main className='w-full flex flex-wrap gap-8 py-4 px-[10%] items-center justify-center'>

      {loading ? (
                    <span className="loader"></span>
                ) : (
                    <>
          <WeatherCard

            place={thisLocation}
            windspeed = {weather.windspeed}
            humidity = {weather.humidity}
            temperature = {weather.temp}
            heatIndex = {weather.heatIndex}
            iconString = {weather.conditions}
            conditions = {weather.conditions}

          />

        <div className='flex justify-center gap-8 flex-wrap w-[60%]'>

          {dailyForecast.map((day) => (
                <MiniCard
                    key={day.dt}
                    time={day.dt_txt}
                    temp={day.main.temp}
                    iconString={day.weather[0].description}
                  />
          ))}
        </div>

        </>
                )}
        

      </main>

    </div>
  );
}

export default App
