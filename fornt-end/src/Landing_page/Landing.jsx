import { useState,  } from 'react';
import { useNavigate } from 'react-router-dom';
import { colorThemes } from '../colorThemes/colorThemes';
import Navbar from './navBar';
import Hero from './Hero';
import Features from './Features';
import VideoSection from './videoSection';
import Jobs from './jobs';
import Gallery from './Gallery';
import About from './About';
import ThemeSwitcher from '../colorThemes/themeSwitcher';

function Landing() {
  const [theme, setTheme] = useState('blue');
  const currentTheme = colorThemes[theme];
  const navigate = useNavigate();
  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} text-white overflow-hidden`}>
      <Navbar theme={currentTheme} />
      <Hero theme={currentTheme} />
      <Features theme={currentTheme} />
      <VideoSection theme={currentTheme} />
      <Jobs theme={currentTheme} />
      <Gallery theme={currentTheme} />
      <About theme={currentTheme} />
    </div>
  );
}





export default Landing;