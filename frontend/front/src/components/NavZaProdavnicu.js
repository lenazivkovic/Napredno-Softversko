import { Col, Nav, Navbar, Row } from 'react-bootstrap';
import { useState } from 'react';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import { Button } from 'react-bootstrap';
import '../index.css';
import { useRef } from 'react';
import { useEffect } from 'react';

//props -kategorije
//props1-boolean
//props3-formated
//props4//identifikator prodavnice

export default function Sidebar(props, props1, props3, props4) {
  // props.categories.forEach((c) => {
  //   console.log(props.formated[c]);
  // });

  const [isSideMenu, setSideMenu] = useState(props1.bul);

  function open(isSideMenu) {
    return setSideMenu(!isSideMenu);
  }

  const domeNode = useRef();

  const updateState = (event) => {
    if (domeNode.current.contains(event.target)) {
      return;
    }
    setSideMenu(false);
  };

  /*  useEffect(() => {
        document.addEventListener('mousedown', updateState)
        return () => {
          document.removeEventListener('mousedown', updateState)
        }
      }, []) */

  return (
    <>
      {props.formated && (
        <div>
          <Button className="kategorije-menu" onClick={() => open(isSideMenu)}>
            <i className="fas fa-bars"></i>
          </Button>
          <div
            className={
              isSideMenu
                ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
                : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
            }
          >
            <Nav className="flex-column  w-100 p-2">
              <Nav.Item>
                <strong>Kategorije</strong>
              </Nav.Item>

              {props.categories.map((c) => (
                <Nav.Item key={c}>
                  <LinkContainer
                    //to={`/searchproduct?category=${c}&identifikator=${props.id}`}
                    to={`/searchproduct/${props.id}?category=${c}`}
                    onClick={() => {
                      open(isSideMenu);
                    }}
                  >
                    <Nav.Link>
                      <strong>{c}</strong>
                      {props.formated[c].map((element) => (
                        <Nav.Link>{element}</Nav.Link>
                      ))}
                    </Nav.Link>

                    {/* <Nav>
                      {props.formated[String(c)].map((f) => (
                        <div>
                          console.log(f);
                          <Nav.Item key={f}>
                            <LinkContainer
                              to={`/searchproduct?category=${c}&identifikator=${props.id}`}
                              onClick={() => {
                                open(isSideMenu);
                              }}
                            >
                              <Nav.Link>
                                <strong>{f}</strong>
                              </Nav.Link>
                            </LinkContainer>
                          </Nav.Item>
                        </div>
                      ))}
                      ;
                    </Nav> */}
                  </LinkContainer>
                </Nav.Item>
              ))}
            </Nav>
          </div>
        </div>
      )}
    </>
  );
}
