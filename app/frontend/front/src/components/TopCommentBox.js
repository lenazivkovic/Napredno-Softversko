import axios from 'axios';
import './Commentcss/Comments.css';
import { useKomentarContext } from '../Context';
import { useContext } from 'react';
import { Store1 } from '../Store';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import MessageBox from './MessageBox';
const { useRef, useState } = require('react');

function TopCommentBox(props) {
  const { setMessageReset, setMethodIncrement } = useKomentarContext();

  const message = useRef(null);

  const [showCommentLine, setCommentLine] = useState(false);
  const [showButton, setShowButtons] = useState(false);
  const [enableBtn, setEnableBtn] = useState(false);
  const navigate = useNavigate();

  const { state } = useContext(Store1);
  const { userInfo } = state;
  const params = useParams();
  const { id } = params;
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
      setEnableBtn(false);
    } else {
      setEnableBtn(true);
    }
  };
  const sendComment = async (event) => {
    event.preventDefault();
    console.log("nepotrebno pravim i komentar :)");
    const { data } = await axios.post(
      `http://localhost:3000/api/v1/stores/${id}/comments`,
      {
        comment: message.current.value,
      },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    ); //za postavljanje novog komentare,saljes message.current.value,2. po redu user creates a new comment
    console.log(data);

    setMessageReset((prevState) => !prevState);
    setMethodIncrement(10);
    message.current.value = '';
    setEnableBtn(false);
  };

  return (
    userInfo && (
      <form>
        <section className="commentBox">
          <input
            autoFocus={props.autoFocus}
            type="text"
            placeholder="Dodaj komentar..."
            ref={message}
            onFocus={commentFocus}
            onBlur={commentFocusOut}
            onkeyUp={commentStroke}
          ></input>
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
}
export default TopCommentBox;
