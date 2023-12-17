import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useContext } from 'react';
import { Store1 } from '../Store';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
function Product(props) {
  const { product } = props;
  const { state, dispatch: cxtDispatch } = useContext(Store1);
  const {
    cart: { cartItems },
  } = state;

  const dodajUKorpuHandler = async (i) => {
    
    const postoji = cartItems.find((x) => x.id === product._id);
    const quantity = postoji ? postoji.quantity + 1 : 1;
    const { data } = await axios.get(
      `http://localhost:3000/api/v1/products/${i._id}`
    );
    if (data.countInStock < quantity) {
      window.alert('Proizvod je nedostupan');
      return;
    }
    cxtDispatch({ type: 'CART_ADD_ITEM', payload: { ...i, quantity } });
  };

  return (
    <Card>
      <Link to={`/product/${product._id}`}>
        
        <img
          src={`http://localhost:3000/${product.image}`}
          className="card-img-top"
          alt="Nema slike"
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title className="kartica">{product.name}</Card.Title>
        </Link>
        <Card.Text>{product.price}rsd</Card.Text>
        {product.countInStock === 0 ? (
          <Button cariant="light" disabled>
            Nema na stanju
          </Button>
        ) : (
          <Button className="add-cart" onClick={() => dodajUKorpuHandler(product)}>
            Dodaj u korpu
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;