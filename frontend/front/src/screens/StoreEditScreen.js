import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Container, Form, Image } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSign from '../components/LoadingSign';
import MessageBox from '../components/MessageBox';
import { Store1 } from '../Store';
import { getError } from '../utils';
import { Button } from 'react-bootstrap';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, prodavnica: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
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

    default:
      return state;
  }
};

export default function ProductEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: storeId } = params;

  const { state } = useContext(Store1);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, { loading: true, error: '' });

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState('');
  //const[images,setImages]=useState([]);
  const [category, setCategory] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/stores/${storeId}`
        );
        setName(data.data.name);

        setImage(data.data.logoImage);
        //setImagesa(data.images);
        setCategory(data.data.category);

        setDescription(data.data.description);

        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [storeId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.patch(
        `http://localhost:3000/api/v1/stores/${storeId}`,
        {
          // _id: storeId,
          name,
          address,

          //logoImage: image,
          //images,
          category,

          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Uspešno editovana prodavnica');
      navigate('/leadadmin/stores');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };
  const uploadFileHandler = async (e /*,forImages*/) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post(
        'http://localhost:3000/api/v1/stores',
        bodyFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'UPLOAD_SUCCESS' });
      toast.succes('Slika je uspešno učitana');
      /*if(forImages)
                {
                      setImages([...images,data.secure_url]);
                 }
                 else{
                       setImage(data.secure_url);
                 } */
      setImage(data.secure_url);
      // toast.succes('Image uploaded successfully.Click on it');
    } catch (err) {
      //toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };

  const deleteFileHandler = async (fileName) => {
    //setImages(images.filter((x)=>x!==fileName));
    //toast.succes('Image deleted successfully');
  };
  function klikni() {
    navigate(`/leadadmin/stores`);
  }
  return (
    <Container className="small-container">
      <h1>Izmena prodavnice</h1>
      {loading ? (
        <LoadingSign></LoadingSign>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
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
          <Form.Group className="mb-3" controlId="_id">
            <Form.Label>Id</Form.Label>
            <Form.Control
              value={storeId} /*onChange={(e)=>setId(e.target.value)}*/
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Logo</Form.Label>
            {/* <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            /> */}
            <Image src={`http://localhost:3000/${image}`}></Image>
          </Form.Group>

          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload file</Form.Label>
            <Form.Control type="file" onChange={uploadFileHandler} />
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
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
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
              Izmeni
            </Button>
            {loadingUpdate && <LoadingSign></LoadingSign>}
          </div>
        </Form>
      )}
    </Container>
  );
}
