import React from 'react';
import '../App.css';
import './HeroSection.css';
import { Button } from './Button';

const HeroSection = () => {
  return (
    <div className="hero-container">
      <div className="naslov">
        <h1 color="white">MERKUR</h1>
        <p>Efikasno Rešava Kupovinu u Radnjama</p>
      </div>
      <div className="hero-btns">
        <Button
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
        >
          <i className="fa fa-question" /> Uputstvo za korišćenje
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
