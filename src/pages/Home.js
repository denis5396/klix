import React, { useEffect } from "react";
import HomeMain from "../components/HomeMain/HomeMain";
import HomeSub from "../components/HomeSub/HomeSub";
import { v1 as uuid } from "uuid";

const Home = ({ route }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <div key={uuid()}>
      <HomeMain route={route} />
      <HomeSub route={route} />
    </div>
  );
};

export default Home;
