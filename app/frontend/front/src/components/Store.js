import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "../index.css";
import Rating from './Raiting';
function Store(props) {
  const { store } = props;

  return (
    <Card style={{border:"10px solid red"}}>
      <Link to={`/store/${store._id}`}>
        <img
          src={`http://localhost:3000/${store.logoImage}`}
          className="card-img-top"
          alt="Nema slike"
        />
      </Link>
      <Card.Body>
        <Link to={`/store/${store._id}`}>
          <Card.Title className="kartica">{store.name}</Card.Title>
        </Link>

        <Rating
          rating={store.averageReview}
          numOfReviews={store.numOfReviews}
         // caption={store.description}
        ></Rating>
      
        <Card.Text>{store.address}</Card.Text>
      </Card.Body>
    </Card>
  );
}
export default Store;
