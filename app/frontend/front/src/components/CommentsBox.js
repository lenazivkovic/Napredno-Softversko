import React, { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKomentarContext } from '../Context';
import axios from 'axios';
import { Store1 } from '../Store';
import './Commentcss/Comments.css';

const CommentsBox = (props) => {
  const { setMessageReset } = useKomentarContext();
  const message = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showCommentLine, setCommentLine] = useState(false);
  const [showButton, setShowButtons] = useState(false);
  const [enableBtn, setEnableBtn] = useState(false);

  const { state } = useContext(Store1);
  const { userInfo } = state;

  const commentFocus = () => {
    setCommentLine(true);
    setShowButtons(true);
  };

  const commentFocusOut = () => {
    setCommentLine(false);
  };

  const commentStroke = (event) => {
    let trenutna = event.target.value;
    if (trenutna) {
      console.log('eo me');
      setEnableBtn(false);
    } else {
      setEnableBtn(true);
    }
  };

  const sendComment = async (event) => {
    if (userInfo) {
      event.preventDefault();
      const { data } = await axios.post(
        `http://localhost:3000/api/v1/comments/reply/${props.useKey}`,
        {
          comment: message.current?.value,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log(data);
      setMessageReset((prevState) => !prevState);
      message.current.value = '';
      setEnableBtn(false);
    } else navigate('http://localhost:3000/login');
  };

  return (
    userInfo && (
      <form>
        <section className="commentBox">
          <input
            autoFocus={props.autoFocus}
            type="text"
            placeholder="Odgovorite..."
            ref={message}
            onFocus={commentFocus}
            onBlur={commentFocusOut}
            onKeyUp={commentStroke}
          />
          {showCommentLine && <div className="commentLine"></div>}
        </section>
        {showButton && (
          <>
            <button
              className="commentButton sendButton"
              disabled={enableBtn}
              onClick={sendComment}
            >
              COMMENT
            </button>
            <button
              className="commentButton "
              style={{ color: 'gray', backgroundColor: 'transparent' }}
              onClick={() => {
                setShowButtons(false);
                message.current.value = '';
              }}
            >
              CANCEL
            </button>
          </>
        )}
      </form>
    )
  );
};

export default CommentsBox;
