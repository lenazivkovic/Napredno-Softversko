import React, { useReducer } from 'react';
import * as tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

import Button from 'react-bootstrap/Button';
import { Container, Form } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect, useRef } from 'react';
import { Store1 } from '../Store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import logger from 'use-reducer-logger';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, prodavnica: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function MapScreen() {
  const mapElement = useRef();
  const [map, setMap] = useState({});
  const [radius, setRadius] = useState(30000);
  const [radiusHolder, setRadiusHolder] = useState(30000);
  const [unitHolder, setUnitHolder] = useState('m');
  const [unit, setUnit] = useState('m');
  const [longitude, setLongitude] = useState(21.8954);
  const [latitude, setLatitude] = useState(43.3209);
  const [i, setInput] = useState('Unesite radius');
  const [{ loading, error, prodavnica }, dispatch] = useReducer(
    logger(reducer),
    {
      prodavnica: [],
      loading: true,
      error: '',
    }
  );
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          `http://localhost:3000/api/v1/stores/stores-within/${radius}/center/${latitude},${longitude}/unit/${unit}`
        );

        dispatch({ type: 'FETCH_SUCCESS', payload: result.data.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [radius, latitude, longitude, unit]);

  useEffect(() => {
    const map = tt.map({
      key: 'raJY82YMh7iBTcRW6mF5Mk7MPLiG1jMh',
      container: mapElement.current,
      center: [longitude, latitude],
      zoom: 14,
    });
    setMap(map);

    const addMarker = () => {
      const popupOffset = { bottom: [0, -25] };
      const popup = new tt.Popup({ offset: popupOffset }).setHTML('Ovo si ti!');
      const element = document.createElement('div');
      element.className = 'userMarker';
     
      const marker = new tt.Marker({
        draggable: true,
        element: element,
      })
        .setLngLat([longitude, latitude])
        .addTo(map);
      marker.on('dragend', () => {
        const lnglat = marker.getLngLat();
        setLongitude(lnglat.lng);
        setLatitude(lnglat.lat);
      });
      marker.setPopup(popup).togglePopup();
    };

    addMarker();

    const addStoreToMap = (store) => {
      const popupOffset = { bottom: [0, -25] };
      const popup = new tt.Popup({ offset: popupOffset }).setHTML(
        `<h5>${store.name}</h5>
        <p>${store.description}</p>`
      );
      const element = document.createElement('div');
      element.className = 'marker';
      const marker = new tt.Marker({
        element: element,
        draggable: false,
      })
        .setLngLat([
          store.location.coordinates[0],
          store.location.coordinates[1],
        ])
        .addTo(map);
      marker.setPopup(popup);
      store.marker = marker;
    };

    for (let i = 0; i < prodavnica.length; i++) {
      addStoreToMap(prodavnica[i]);
    }

    return () => map.remove();
  }, [prodavnica, latitude, longitude]);
  const submitHandler = async (event) => {
    event.preventDefault();
    setRadius(radius);
    setUnit(unit);

    console.log(radius);
  };

  //uzme vrednosti iz inputa i pozove setRadius i setUnit
  return (
    <>
    <div className="mapiceJerry">
      {map && prodavnica && <div ref={mapElement} className="map"></div>}
      <div className="mapice">
        <h6 style={{color:"gray"}}>Latituda: {latitude}</h6>
        <h6 style={{color:"gray"}}>Longituda: {longitude}</h6>

        <form onSubmit={submitHandler}>
          <h5>Prikazi prodavnice u krugu od: </h5>
          <input
            type="text"
            id="radius"
            value={radiusHolder}
            className="radius"
            onChange={(e) => setRadiusHolder(e.target.value)}
            placeholder="Unesite radius"
          ></input>
          <select
            className="dropdown"
            onChange={(e) => setUnitHolder(e.target.value)}
          >
            <option value="m">m</option>
            <option value="km">km</option>
          </select>
          {/*  <input type="submit" value="Submit" onSubmit={submitHandler}></input> */}
          <button
            type="submit"
            onClick={() => {
              setRadius(radiusHolder);
              setUnit(unitHolder);
            }}
          >
            Primeni
          </button>
        </form>
      </div>
      <ListGroup>
        {prodavnica.map((p) => (
          <ListGroupItem className='opcijica'
            onClick={() => {
              p.marker.togglePopup();
            }}
          >
            {p.name}
          </ListGroupItem>
        ))}
      </ListGroup>
      <br></br><br></br>
      </div>
    </>
  );
}
