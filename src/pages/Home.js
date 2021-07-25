import React, { useEffect } from 'react';
import HomeMain from '../components/HomeMain/HomeMain';
import HomeSub from '../components/HomeSub/HomeSub';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <HomeMain />
      <HomeSub />
    </>
  );
};

export default Home;
