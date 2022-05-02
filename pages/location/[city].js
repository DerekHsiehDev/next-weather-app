import Head from "next/head";
import React from "react";
import cities from "../../lib/city.list.json";
import TodaysWeather from "../../components/TodaysWeather";
import moment from "moment-timezone";
import HourlyWeather from "../../components/HourlyWeather";
import WeeklyWeather from "../../components/WeeklyWeather";
import SearchBox from "../../components/SearchBox";
import Link from "next/link";

// need to run this if data changes often
export async function getServerSideProps(context) {
  const city = getCity(context.params.city);
  // api call here
  console.log(city);

  if (!city) {
    return {
      notFound: true,
    };
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}&units=imperial&exclude=minutely`
  );

  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  } else {
    console.log(data);
  }

  console.log(process.env.API_KEY);

  const slug = context.params.city;

  const hourlyWeather = getHourlyWeather(data.hourly, data.timezone);

  return {
    props: {
      city: city,
      currentWeather: data.current,
      dailyWeather: data.daily,
      hourlyWeather: hourlyWeather,
      timezone: data.timezone,
    },
  };
}

const getCity = (param) => {
  const cityParam = param.trim();
  const splitCity = cityParam.split("-");
  const id = splitCity[splitCity.length - 1];
  console.log(id);

  if (!id) {
    return null;
  }

  const city = cities.find((city) => city.id.toString() == id);

  if (city) {
    return city;
  } else {
    return null;
  }
};

const getHourlyWeather = (hourlyData, timezone) => {
  const endOfDay = moment().tz(timezone).endOf("day").valueOf();

  const eodTimeStamp = Math.floor(endOfDay / 1000);

  const todayData = hourlyData.filter((data) => data.dt < eodTimeStamp);

  return todayData;
};

export default function City({
  hourlyWeather,
  data,
  currentWeather,
  timezone,
  dailyWeather,
  city,
}) {
  // console.log(hourlyData);
  return (
    <div>
      <Head>
        <title>{city.name} Weather - Next Weather App</title>
      </Head>

      <div className="page-wrapper">
        <div className="container">
          <Link href="/">
            <a className="back-link">&larr; Home</a>
          </Link>
          <SearchBox placeholder="Search for another location.." />
          <TodaysWeather
            timezone={timezone}
            city={city}
            weather={dailyWeather[0]}
          />
          <HourlyWeather hourlyWeather={hourlyWeather} timezone={timezone} />
          <WeeklyWeather weeklyWeather={dailyWeather} timezone={timezone} />
        </div>
      </div>
    </div>
  );
}
