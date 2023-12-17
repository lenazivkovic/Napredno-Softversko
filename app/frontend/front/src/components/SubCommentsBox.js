import "./Commentcss/Comments.css";
import { useKomentarContext } from "../Context";
import {useOpenReply} from './Message.js';
import axios from "axios";
import { Store1 } from "../Store";
import { useNavigate } from "react-router-dom";

const { useRef, useState, useContext } = require("react");
function SubcommentsBox(props)
{
    const {setMessageUpdate,setMessageReset}=useKomentarContext();
    const changeOpenReply=useOpenReply();
    const message=useRef(null);
    const navigate=useNavigate();
    const [showCommentLine,setCommentLine]=useState(false);
    const[showButton,setShowButtons]=useState(false);
    const[enableBtn,setEnableBtn]=useState(false);
    const {state}=useContext(Store1);
    const {userInfo}=state;

    const commentFocus=()=>{
        setCommentLine(true);
        setShowButtons(true);

    }
    const commentFocusOut=()=>
    {
        setCommentLine(false);
    }

    const commentStroke=event=>
    {
        let trenutna=event.target.value;
        if(trenutna)
        {
            setEnableBtn(false);
        }
        else{
            setEnableBtn(true);
        }
    }
const sendComment= async (event)=>{
    if(userInfo){
    event.preventDefault();
    console.log("pozvao sam pravii :DDDDDDDDD");
    const {data}=await axios.post(`http://localhost:3000/comments/reply/${props.parentKey}`,
    {
        comment:message.current.value
    },
    {
        headers: { Authorization: `Bearer ${userInfo.token}`}
    })//props.parentKey,message.current.value//user creates a new comment from sub box
    setMessageReset((prevState)=>!prevState);
    message.current.value='';
    setEnableBtn(false);
}
else
navigate('http://localhost:3000/login');
}
    return userInfo &&(
        <form>
            <section className="commentBox">
                <input
                autoFocus={props.autoFocus}
                type="text"
                placeholder="Dodaj odgovor..."
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
                 disabled={enableBtn} onClick={sendComment}>
                    COMMENT
                    </button>
                <button className="commentButton " style={{color:"gray",backgroundColor:"transparent"}}
                onClick={()=>{
                    setShowButtons(false);
                    message.current.value = '';
                    }}>CANCEL</button>
                
                </>
            )}
        </form>
    )

}
export default SubcommentsBox;