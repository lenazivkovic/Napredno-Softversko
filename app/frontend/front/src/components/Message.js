import axios from 'axios';
import React, { useRef, useState, useContext } from 'react';
import './Commentcss/Messagea.css';
import CommentsBox from './CommentsBox';
import SubMessage from './SubMessage';
import { useKomentarContext } from '../Context';
import { Store1 } from '../Store';
import './Commentcss/Messagea.css';
import { Navigate, useNavigate } from 'react-router-dom';
const showReply = React.createContext();

export function useOpenReply() {
  return useContext(showReply);
}

function Message(props) {
  const { setMessageUpdate, setMessageReset, messageUpdate } =
    useKomentarContext();

  const likeIcon = useRef();
  const dislikeIcon = useRef();
  const numLikes = useRef();
  const numDislikes = useRef();
  const navigate = useNavigate();
  const [arrowUp, setArrowUp] = useState(false);
  const [openReply, setOpenReply] = useState(false);

  const { state } = useContext(Store1);
  const { userInfo } = state;

  const changeOpenReply = () => {
    setOpenReply((prevState) => !prevState);
  };

  let arrow = <i className="fas fa-caret-down"></i>;
  const changeArrow = () => {
    setArrowUp((prevState) => (prevState = !prevState));
  };

  if (arrowUp) {
    arrow = <i className="fas fa-caret-up"></i>;
  } else {
    arrow = <i className="fas fa-caret-down"></i>;
  }

  let toggleLike = false;
  let toggleLike1 = false;

  let likes = props.likes;
  let dislikes = props.dislikes;

  const likeComment = () => {
    if (userInfo && props.userID!==userInfo.data.user._id) {
      if (!props.likedBy.includes(userInfo.data.user._id) && !props.dislikedBy.includes(userInfo.data.user._id)) {
        props.likedBy.push(userInfo.data.user._id);
        toggleLike = true;
        if (toggleLike) {
          likes++;
          likeIcon.current.style.color = '#4688de';
        } else {
          likes--;
          likeIcon.current.style.color = 'gray';
        }
        numLikes.current.innerHTML = likes;

        axios.patch(
          `http://localhost:3000/api/v1/comments/update-like`,
          {
            messageId: props.useKey,
            likes: numLikes.current.innerHTML,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        ); //ovde like i unlike
      }
    }
  };

  const dislikeComment = () => {
    if (userInfo && props.userID!==userInfo.data.user._id) {
      if (!props.dislikedBy.includes(userInfo.data.user._id) && !props.likedBy.includes(userInfo.data.user._id)) {
        props.dislikedBy.push(userInfo.data.user._id);
        toggleLike1 = true;
      if (toggleLike1) {
        dislikes++;
        dislikeIcon.current.style.color = '#4688de';
      } else {
        dislikes--;
        dislikeIcon.current.style.color = 'gray';
      }
      numDislikes.current.innerHTML = dislikes;
      axios.patch(
        `http://localhost:3000/api/v1/comments/update-dislike`,
        {
          messageId: props.useKey,
          dislikes: numDislikes.current.innerHTML,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
    }}
  };
  const deleteMessage = async (event) => {

    event.preventDefault();
    console.log("eoo mee u kontroler za komentar", props.useKey);
    try{
   
    await axios.delete(

      `http://localhost:3000/api/v1/comments/${props.useKey}`, //bilo props.useKey
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }

    );
    setMessageUpdate([2, props._id]);
 
    }catch(err)
    {
      console.log(err.Message);
    }
  
  };

  /* const{data}={axios.patch(`http://localhost:3000/api/v1/comments/update-like`,
{
    messageId:props.useKey,
    likes:numLikes.current.value
},
{
    headers: { Authorization: `Bearer ${userInfo.token}`}
}}
);//p rops.useKey,likes  ,user liked,unliked message*/

  return  (
    <>
      <section className="messageContainer">
        <div className="messageUser">{props.user}</div>
        <i className="fas fa-user-circle"></i>
        <div className="messageText">{props.mes}</div>
        <section className="messageIconsContainer">
          <div className="lajk">
          <div>
            <i
              className="fas fa-thumbs-up"
              ref={likeIcon}
              onClick={likeComment}
              style={
                
                ( userInfo &&  !props.likedBy.includes(userInfo.data.user._id))
                  ? { color: 'gray' }
                  : { color: '#4688de' }
              }
            ></i>
            <div ref={numLikes}>{props.likes}</div>
            </div>
            <div>
            <i
              className="fas fa-thumbs-down"
              ref={dislikeIcon}
              onClick={dislikeComment}
              style={
                ( userInfo &&  !props.dislikedBy.includes(userInfo.data.user._id))
                  ? { color: 'gray' }
                  : { color: '#4688de' }
              }
            ></i>

            <div ref={numDislikes}>{props.dislikes}</div> </div>
            {userInfo && props.userID === userInfo.data.user._id && (
              <div onClick={deleteMessage} style={{ cursor: 'pointer' }}>
                OBRISI
              </div>
            )}
          </div>
          {userInfo && (
            <div onClick={changeOpenReply} style={{ cursor: 'pointer' }}>
              ODGOVORI
            </div>
          )}
        </section>
        <showReply.Provider value={changeOpenReply}>
          {openReply && <CommentsBox useKey={props.useKey} autoFocus={true} />}
        </showReply.Provider>

        {console.log(props)}
        {props.replies.length > 0 && (
          <section className="arrowReplies" onClick={changeArrow}>
            {arrow}
            <div> {props.replies.length} odgovora</div>
          </section>
        )}
        {arrowUp && (
          <section className="subMessage">
            {props.replies.map((rep) => (
              <div>
                {console.log('OVO JE ODGOVOR' + rep.comment)}
                <SubMessage
                  key={Math.random()}
                  parentKey={props.useKey}
                  subId={rep._id}
                  user={rep.user.name}
                  userID={rep.user._id}
                  likedBy={rep.likedBy}
                  dislikedBy={rep.dislikedBy}
                  message={rep.comment}
                  likes={rep.numOfLikes}
                  dislikes={rep.numOfDislikes}
                />
              </div>
            ))}
          </section>
        )}
      </section>
    </>
  );
}
export default Message;
