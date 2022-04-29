import React from "react";
import cities from "../../lib/city.list.json"

// need to run this if data changes often
export async function getServerSideProps(context) {
  const city = getCity(context.params.city);
  // api call here
  console.log(city);

  if(!city) {
    return {
      notFound: true,
    }
  }

  const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}&units=imperial&exclude=minutely`)
  
  const data = await res.json()

  if(!data) {
    return {
      notFound: true
    } 
  } else {
    console.log(data)
  }

  console.log(process.env.API_KEY)

  const slug = context.params.city;

  return {
    props: {
      slug: slug,
      data: data,
      city: city,
      currentWeather: data.current,
      dailyWeather: data.daily
    },
  };
}

const getCity = (param) => {
  const cityParam = param.trim();
  const splitCity = cityParam.split("-");
  const id = splitCity[splitCity.length - 1];
  console.log(id);

  if(!id) {
    return null;
  }

  const city = cities.find(city => city.id.toString() == id);

  if(city) {
    return city
  } else {
    return null
  }

};

const getHourlyWeather = (hourlyData) => {
  const current = new Date()

  current.setHours(curent.getHours(), 0, 0, 0);

  const tomororw = new Date(current);
  tomororw.setDate(tomororw.getDate() + 1)
  tomorrow.setHours(0,0,0,0);

  const currentTimeStamp = Math.floor(current.getTime() / 1000)
  const tomororwTimeStamp = Math.floor(tomororw.getTime / 1000)


  const todayData = hourlyData.filter(data => data.dt < tomororwTimeStamp)
  
  return todayData;

}

export default function City({ slug, data }) {
  // console.log(data)
  return (
    <div>
      <h1>city page</h1>
      <h2>{slug}</h2>
    </div>
  );
}
