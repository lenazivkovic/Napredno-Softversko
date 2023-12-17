import axios from 'axios';
import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
  useRef,
} from 'react';
import { Container, Form, Image } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSign from '../components/LoadingSign';
import MessageBox from '../components/MessageBox';
import { Store1 } from '../Store';
import { getError } from '../utils';
import { Button } from 'react-bootstrap';

import * as tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, categories: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: 'greskica' };

    default:
      return state;
  }
};

const pribaviKategorije = async () => {};

export default function AddStoreScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: storeId } = params;

  const { state } = useContext(Store1);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, { errorUpload: '' });

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('Restoran');
  const [latitude, setLatitude] = useState(43.3209);
  const [longitude, setLongitude] = useState(21.8954);
  const [map, setMap] = useState({});
  const mapElement = useRef();

  const [description, setDescription] = useState('');
  useEffect(() => {
    async function fja1() {
      try {
        const { data } = await axios.get(
          'http://localhost:3000/api/v1/stores/categories'
        );
        setCategories(data.data);
        console.log(data);
      } catch (err) {}
    }
    fja1();
  }, []);
  //ucitavanje mape
  useEffect(() => {
    let map = tt.map({
      key: 'raJY82YMh7iBTcRW6mF5Mk7MPLiG1jMh',
      container: mapElement.current,
      center: [longitude, latitude],
      zoom: 14,
    });
    setMap(map);

    const addMarker = () => {
      const element = document.createElement('div');
      element.className = 'marker';
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
    };
    addMarker();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const bodyFormData = new FormData();
      bodyFormData.append('logoImage', image);
      bodyFormData.append('name', name);
      bodyFormData.append('address', address);

      bodyFormData.append('category', category);
      bodyFormData.append('coordinates[0]', longitude);
      bodyFormData.append('coordinates[1]', latitude);
      bodyFormData.append('description', description);

      dispatch({ type: 'CREATE_REQUEST' });
      await axios.post(
        `http://localhost:3000/api/v1/stores/`,
        // {
        //   name,
        //   address,

        //   logoImage: image,

        //   category,
        //   coordinates: [longitude, latitude],

        //   description,
        // },
        bodyFormData,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('Uspešno dodata prodavnica');
      navigate('/leadadmin/stores');
    } catch (err) {
      alert(err.message);
      toast.error(getError(err));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  const fileHandler = (e) => {
    const file = e.target.files[0];

    if (file.size > 2048 * 1024) alert('Velicina slike mora biti ispod 2MB');
    else {
      setImage(file);
    }
  };

  // const uploadFileHandler = async (e /*,forImages*/) => {
  //   const file = e.target.files[0];
  //   const bodyFormData = new FormData();
  //   bodyFormData.append('file', file);
  //   try {
  //     dispatch({ type: 'UPLOAD_REQUEST' });
  //     const { data } = await axios.post(
  //       'http://localhost:3000/api/v1/stores',
  //       bodyFormData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           authorization: `Bearer ${userInfo.token}`,
  //         },
  //       }
  //     );
  //     dispatch({ type: 'UPLOAD_SUCCESS' });
  //     //toast.succes('Image uploaded successfully');
  //     /*if(forImages)
  //               {
  //                     setImages([...images,data.secure_url]);
  //                }
  //                else{
  //                      setImage(data.secure_url);
  //                } */
  //     setImage(data.secure_url);
  //     // toast.succes('Image uploaded successfully.Click on it');
  //   } catch (err) {
  //     //toast.error(getError(err));
  //     dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
  //   }
  // };

  const deleteFileHandler = async (fileName) => {
    //setImages(images.filter((x)=>x!==fileName));
    //toast.succes('Image deleted successfully');
  };
  function klikni() {
    navigate(`/leadadmin/stores`);
  }
  
  return (
    <Container className="small-container">
      <h1>Dodavanje prodavnice</h1>

      <Form onSubmit={submitHandler}>
      <Button onClick={klikni}>Nazad</Button>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Ime</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="imageFile">
          <Form.Label>Upload file</Form.Label>
          <Form.Control type="file" onChange={fileHandler} />
          {loadingUpload && <LoadingSign></LoadingSign>}
        </Form.Group>

        {/* /* <Form.Group className="mb-3" controlId="imageFile">
                            <Form.Label>Upload image</Form.Label>
                            <Form.Control type="file"  onChange={uploadFileHandler}/>
                            {loadingUpload &&<LoadingSign></LoadingSign>}
                        </Form.Group> 
                        <Form.Group className="mb-3" controlId="additionalImage">
                            <Form.Label>Nova Slika</Form.Label>
        
                            {images.length===0 && <MessageBox>Nema</>}
                            <ListGroup variant="flush">
                            {images.map((x)=>(
                                <ListGroup.Item key={x}>{x}
                                <Button variant="light" onClick{()=>deleteFileHandler(x)}>
                                <i className="fa fa-times-circle"></i>
                                </>
                                </>
                            ))}
                        </Form.Group> 

                        <Form.Group className="mb-3" controlId="additionalimageFile">
                            <Form.Label>Upload aditional image</Form.Label>
                            <Form.Control type="file"  onChange={(e)=>uploadFileHandler(e,true)}/>
                            {loadingUpload &&<LoadingSign></LoadingSign>}
                        </Form.Group> 
                        
                        
                        */}
        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Kategorija</Form.Label>
          {/* <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            /> */}
          <Form.Select
            aria-label="Default select example"
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            {categories.map((kategorija) => (
              <option value={kategorija}>{kategorija}</option>
            ))}

            {/* <option>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option> */}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Longituda</Form.Label>
          <Form.Control
            value={longitude}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Latituda</Form.Label>
          <Form.Control
            value={latitude}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <div className="map" ref={mapElement}></div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Opis</Form.Label>
          <Form.Control
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3">
          <Button disabled={loadingUpdate} type="submit">
            Dodaj
          </Button>
          {loadingUpdate && <LoadingSign></LoadingSign>}
        </div>
      </Form>
    </Container>
  );
}

//name,description,category
//longitude, latitude,logoImage,address
