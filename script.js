document.addEventListener('DOMContentLoaded', function () {
const timeE1=document.getElementById('time');
const dateE1=document.getElementById('date');
const currentWeatherItemsE1=document.getElementById('current-weather-item');
const timeZone=document.getElementById('time-zone');
const countryE1=document.getElementById('country');
const weatherForcastE1=document.getElementById('weather-forcast');  
const currentTempE1 = document.getElementById('current-temp');

const days= ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months= ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const API_KEY='5c444d1d6721cf2045751bb23117fa72';

setInterval(() => {
    const time=new Date();
    const month=time.getMonth();
    const date=time.getDate();
    const day=time.getDay();
    const hours=time.getHours();
    const minute=time.getMinutes();
    const hourin12=hours >= 13 ? hours%12 : hours;
    const ampm=hours >= 12 ? 'PM' : 'AM';

    if (minute < 10)
    {
        timeE1.innerHTML= hourin12+':0'+minute+' '+`<span id="am-pm">${ampm}</span>`;
    }
    else
    {
        timeE1.innerHTML= `${hourin12}:${minute} <span id="am-pm">${ampm}</span>`;
    }
    
    dateE1.innerHTML=days[day]+','+date+' '+months[month];
    
}, 1000);

getWeatherData();
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let {latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data)
            showWeatherData(data);
        })
    })
}

function showWeatherData(data) {
    const { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

    timeZone.innerHTML = data.timezone;
    countryE1.innerHTML = data.lat + 'N ' + data.lon + 'E';

    const sunriseTime = new Date(sunrise * 1000);
    const sunsetTime = new Date(sunset * 1000);

    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

    currentWeatherItemsE1.innerHTML =
        `<div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-item">
            <div>Pressure</div>
            <div>${pressure}</div>
        </div>
        <div class="weather-item">
            <div>Wind Speed</div>
            <div>${wind_speed}</div>
        </div>
        <div class="weather-item">
            <div>Sunrise</div>
            <div>${sunriseTime.toLocaleTimeString(undefined, timeOptions)}</div>
        </div>
        <div class="weather-item">
            <div>Sunset</div>
            <div>${sunsetTime.toLocaleTimeString(undefined, timeOptions)}</div>
        </div>`;

        let otherDayForcast = '';
        data.daily.forEach((day, idx) => {
            if (idx == 0) {
                currentTempE1.innerHTML = `
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
                <div class="other">
                    <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                    <div class="temp">Night - ${day.temp.night}&#176; C</div>
                    <div class="temp">Day - ${day.temp.day}&#176; C</div>
                </div>`;
            } else {
                otherDayForcast += `
                <div class="weather-forcast-item">
                    <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                    <div class="temp">Night - ${day.temp.night}&#176; C</div>
                    <div class="temp">Day - ${day.temp.day}&#176; C</div>
                </div>`;
            }
        });
        
        weatherForcastE1.innerHTML = otherDayForcast;
} 
});