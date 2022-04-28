import React from "react";

// need to run this if data changes often
export async function getServerSideProps(context) {
  const city = getCityID(context.params.city);
  // api call here
  const slug = context.params.city;

  return {
    props: {
      slug: slug,
    },
  };
}

const getCityID = (param) => {
  const cityParam = param.trim();
  const splitCity = cityParam.split("-");
  console.log(splitCity);
};

export default function City({ slug }) {
  return (
    <div>
      <h1>city page</h1>
      <h2>{slug}</h2>
    </div>
  );
}
