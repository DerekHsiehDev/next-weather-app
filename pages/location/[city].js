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

  const slug = context.params.city;

  return {
    props: {
      slug: slug,
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

export default function City({ slug }) {
  return (
    <div>
      <h1>city page</h1>
      <h2>{slug}</h2>
    </div>
  );
}
