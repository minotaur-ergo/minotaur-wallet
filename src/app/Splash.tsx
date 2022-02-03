import React from "react";
import logo from '../logo.svg';
import './Splash.css'

const Splash: React.FC = () => {
  return (
    <div className="splashContainer">
      <img alt="minotaur logo" src={logo} className="img"/>
      <div>Loading ... </div>
    </div>
  )
}

export default Splash;
