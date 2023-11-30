import axios from 'axios';
import React, { useRef, useState, useContext } from 'react';
import { useKomentarContext } from '../Context';
import SubcommentsBox from './SubCommentsBox';
import { Store1 } from '../Store';
import { Navigate } from 'react-router-dom';
const showReply = React.createContext();

export function useOpenReply() {
  return useContext(showReply);
}

function SubMessage(props) {

    const{setMessageUpdate,setMessageReset}=useKomentarContext();
    const likeIcon=useRef();
    const dislikeIcon=useRef();
    const numLikes=useRef();
    const numDislikes=useRef();

  const [openReply, setOpenReply] = useState(false);
  const [arrowUp, setArrowUp] = useState(false);
  const changeOpenReply = () => {
    setOpenReply((prevState) =>
     !prevState);
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




  const{state}=useContext(Store1);
  const {userInfo}=state;


  let toggleLike=false;
  let toggleLike1=false;

  let likes=props.likes;
  let dislikes=props.dislikes;
console.log(likes);
  const likeComment=()=>{
    
      if (userInfo && props.userID!==userInfo.data.user._id) {
        if ( !props.likedBy.includes(userInfo.data.user._id) && !props.dislikedBy.includes(userInfo.data.user._id) ) {
          props.likedBy.push(userInfo.data.user._id);
          toggleLike = true;
       
        if(toggleLike)
        {
          likes++;
            likeIcon.current.style.color="#4688de";
        }
        else{
             likes--;
             likeIcon.current.style.color="gray";
            }
        numLikes.current.innerHTML=likes;
        console.log(numLikes.current.innerHTML)
        axios.patch(`http://localhost:3000/api/v1/comments/update-like`,
        {
            messageId:props.subId,
            likes:numLikes.current.innerHTML
            },
            {
         headers: { Authorization: `Bearer ${userInfo.token}`}
            });//ovde like i unlike

           
    }
  }}


    const dislikeComment=()=>{
   
        if (userInfo && props.userID!==userInfo.data.user._id) {
          if (props.dislikedBy && !props.dislikedBy.includes(userInfo.data.user._id) & !props.likedBy.includes(userInfo.data.user._id)) {
            props.dislikedBy.push(userInfo.data.user._id);
            toggleLike1 = true;
        
    if(toggleLike1)
    {
        dislikes++;
        dislikeIcon.current.style.color="#4688de";
    }
    else{
        dislikes--;
         dislikeIcon.current.style.color="gray";
        }
        numDislikes.current.innerHTML=dislikes;
    axios.patch(`http://localhost:3000/api/v1/comments/update-dislike`,
    {
        messageId:props.subId,
        dislikes:numDislikes.current.innerHTML
        },
{
headers: { Authorization: `Bearer ${userInfo.token}`}

});
    }}}
  const deleteMessage = async(event) => {
    event.preventDefault();
    //console.log("eo mee" ,props.useKey, props.subId);
    await axios.delete(`http://localhost:3000/api/v1/comments/${props.subId}`,
    {
        headers: { Authorization: `Bearer ${userInfo.token}`}
    });//saljemo props.parentKey,props.subId,user wantos to delete a sub-message
    setMessageUpdate([2,props.subId]);//i saljemo props.subId
    setMessageReset(true);
  };
  return (
    <>
      <section className="messageContainer">
        <div className="messageUser">{props.user}</div>
        <i className="fas fa-user-circle"></i>
        <div className="messageText">{props.message}</div>
        <section className="messageIconsContainer">
          <div className='lajk'>
            <div>
          <i
            className="fas fa-thumbs-up"
            ref={likeIcon}
            onClick={likeComment}
            style={
              userInfo &&   !props.likedBy.includes(userInfo.data.user._id)
                ? { color: 'gray' }
                : { color: '#4688de' }
            }
          ></i>
          <div ref={numLikes}>{props.likes}</div>
          </div>
          <div>

          <i className="fas fa-thumbs-down"  ref={dislikeIcon} onClick={dislikeComment}  style={
              userInfo &&  !props.dislikedBy.includes(userInfo.data.user._id)
                  ? { color: 'gray' }
                  : { color: '#4688de' }
              }></i>
          <div ref={numDislikes}>{props.dislikes}</div> </div></div>{
          (userInfo && props.userID===userInfo.data.user._id)
                    &&
            (<div onClick={deleteMessage} style={{ cursor: 'pointer' }}>
              Obrisi
            </div>)
         
           
           
}

        </section>
        <showReply.Provider value={changeOpenReply}>
          {openReply && <SubcommentsBox parentKey={props.parentKey} autoFocus={true} />}
        </showReply.Provider>
        </section>
    </>
  );
}
export default SubMessage;
