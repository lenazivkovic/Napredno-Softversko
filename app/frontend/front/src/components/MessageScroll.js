import React, { useContext, useEffect, useRef, useState } from 'react';

import Message from './Message.js';
import './Commentcss/MessageScroll.css';
import { useKomentarContext } from '../Context.js';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Store1 } from '../Store.js';

function MessageScroll(props) {
  const {
    messageReset,
    commentIncrement,
    setMethodIncrement,
    messageUpdate,
    setMessageReset,
  } = useKomentarContext();
  const [message, setMessage] = useState([]);
  const [showButtonBar, setShowButtonBar] = useState(true);

  const commentIncrementref = useRef(commentIncrement);
  const params = useParams();
  const { id } = params;
  const { state } = useContext(Store1);
  const { userInfo } = state;

  useEffect(() => {
    async function fja1() {
      setShowButtonBar(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/stores/${id}/comments`
      ); //stavi za dodavanje komentara gets documents form collection `1., saljes 10 kao limit na 10komentara

      console.log(data);
      setMessage(data.data); //postavi data na komentare
      setMessageReset(false);
    }
    fja1();
  }, [messageReset]);

  console.log(message);
  useEffect(() => {
    console.log('eheeeeeeeeeeeeeeeeeeeeeeeeej');

    //ako je 1 updatujemo ako ne onda brisemo
    if (messageUpdate) {
      if (messageUpdate[0] === 1) {
        async function fja() {
          console.log('uso sam u drugo');
          const { data } = await axios.patch(
            `http://localhost:3000/api/v1/comments/${messageUpdate[1]}`,
            {
              comment: message.current.value,
            },
            {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            }
          ); //update poruke, messageUpdate[1],user wants to update comment
          console.log(data);
          updateComment(data);
        }
        fja();
      } else if (messageUpdate[0] == 2) {
        console.log('uso sam');

        deleteComment();
      }
    }
  }, [messageUpdate]); //

  function deleteComment() {
    let c = [...message];
    let c1 = c.findIndex((mes) => mes._id === messageUpdate[1]);//ovd 1
    c.splice(c1, 1);
    setMessage(c);
    setMessageReset(true);
  }
  function updateComment(comment) {
    let c = [...message];
    if (comment) {
      let c1 = c.findIndex((m) => m._id === comment._id);
      c.splice(c1, 1, comment);
      setMessage(c);
    }
  }
  const observer = React.useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      async function fja3() {
        console.log(commentIncrementref.current);
        if (first.isIntersecting) {
          const { data } = await axios.get(
            `http://localhost:3000/api/v1/comments/get-more-data/${id}`,
            {
              commentIncrement: commentIncrementref.current,
            }
          ); //commerntincrementref.current se salje,3. interrsection observer wantos
          console.log(data);
          if (data.length > 0) {
            //comments<=>data
            setTimeout(() => {
              setMessage((prevState) => [...prevState, ...data]);
            }, 3000);
          } else {
            setTimeout(() => {
              setShowButtonBar(false);
            }, 3000);

            setMethodIncrement((prevState) => (prevState += data.length));
          }
        }
      }
      fja3();
    }),
    { threshold: 1 }
  );

  useEffect(() => {
    commentIncrementref.current = commentIncrement;
  }, [commentIncrement]);

  const [bottombar, setBottombar] = useState(null);

  useEffect(() => {
    const currentBottomBar = bottombar;
    const currentObserver = observer.current;
    if (currentBottomBar) {
      currentObserver.observe(currentBottomBar);
    }
    return () => {
      if (currentBottomBar) {
        currentObserver.unobserve(currentBottomBar);
      }
    };
  }, [bottombar]);
  console.log('iz messageScrolel' + messageUpdate);
  return (
    <>
      {message.map((mes) => (
        <div>
          {console.log(mes)}
          <Message
            key={mes._id}
            useKey={mes._id}
            user={mes.user.name}
            userID={mes.user._id}
            mes={mes.comment}
            likes={mes.numOfLikes}
            dislikes={mes.numOfDislikes}
            likedBy={mes.likedBy}
            dislikedBy={mes.dislikedBy}
            replies={mes.childrenComments}
          ></Message>
        </div>
      ))}

      {message.length > 9 && showButtonBar ? (
        <div className="bootomBar" ref={setBottombar}>
          <div className="loader"></div>
        </div>
      ) : null}
    </>
  );
}
export default MessageScroll;
