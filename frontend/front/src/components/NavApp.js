import { Col, Nav, Navbar, Row } from "react-bootstrap";
import { useState } from "react";
import LinkContainer from "react-router-bootstrap/LinkContainer";
import { Button } from "react-bootstrap";
import "../index.css"
import { useRef } from "react";
  import { useEffect } from "react";

   
 


export default function  Sidebar(props,props1)
{
    console.log(props.categories);

    const [isSideMenu, setSideMenu] = useState(props1.bul);

    function open(isSideMenu){
      return setSideMenu(!isSideMenu); 
       }

      const domeNode = useRef();

      const updateState = (event) => {
        if (domeNode.current.contains(event.target)) {
          return
        }
        setSideMenu(false)
      }

     /*  useEffect(() => {
        document.addEventListener('mousedown', updateState)
        return () => {
          document.removeEventListener('mousedown', updateState)
        }
      }, []) */
  
    return(
       <div>
         <Button onClick={()=> open(isSideMenu)} className="kategorije-menu">
             <i className="fas fa-bars"></i>
            </Button>
        <div className={isSideMenu? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column': 'side-navbar d-flex justify-content-between flex-wrap flex-column'}>
   {/*  <Navbar  expand="lg"> */}
        <Nav className="flex-column w-100 p-2" expand="lg">
         
        <Nav.Item>
            <strong>Kategorije</strong>
            <hr/>
         </Nav.Item>
        
            {  props.categories.map((c)=>(
                 
                <div className="divIkonicaTekst">
                    <Nav.Item key={c}>
                    <LinkContainer to ={`/search?category=${c}`}
                    onClick={()=> {open(isSideMenu)}}>
                        <Nav.Link className="ikonicaTekst">{c}</Nav.Link>
                    </LinkContainer>
                    </Nav.Item>
                    </div>
            ))
            }
     
        </Nav>
    {/* </Navbar> */}
    </div>
   </div>

    );
}
{/* <div className={sideberIsOpen? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column': 'side-navbar d-flex justify-content-between flex-wrap flex-column'}>
   
   {url === "/" && (
  <Nav className="flex-column  w-100 p-2">
   <Nav.Item>
     <strong>Kategorije</strong>
   </Nav.Item>

      {categories.map((category)=>(
   
       <Nav.Item key={category}>
     
     <LinkContainer to={`/search?category=${category}`}
       onClick={()=>setSidebarIsOpen(false)}>
         <Nav.Link >{category}</Nav.Link>
       </LinkContainer> 
     </Nav.Item> 
  
   ))}
 </Nav> 
 */}