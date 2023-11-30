import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import ProductScreen from './screens/ProductScreen';
import StoreScreen from './screens/StoreScreen';
import SigninScreen from './screens/SinginScreen';
import MapScreen from './screens/MapScreen';
import HomeScreen from './screens/HomeScreen';
import UserScreen from './screens/UserScreen';
import CartScreen from './screens/CartScreen';
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Navbar, Nav, Badge, NavDropdown } from 'react-bootstrap';
import { useContext } from 'react';
import { Store1 } from './Store';

import LoginScreen from './screens/LoginScreen';
import {  ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import React from 'react';
import InputMailScreen from './screens/InputZaMail';
import InputSifraScreen from './screens/InputZaSifruIConfirmSifre';
import { Box, Row, Column, FooterLink, Heading } from './FooterStyles.js';
import './index.css';
import SearchScreen from './screens/SearchScreen';
import Protected from './components/Protected';
import Admin from './components/Admin.tsx';
import SearchProductsScreen from './screens/SearchProductsScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import ProductListScreen from './screens/ProductListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import NeuspehScreen from './screens/NeuspehScreen';
import HelpScreen from './screens/HelpScreen';
import LeadAdmin from './components/LeadAdmin.tsx';
import AddStoreScreen from './screens/AddStoreScreen';
import StoreEditScreen from './screens/StoreEditScreen';
import StoreListScreen from './screens/StoreListScreen';
import LeadAdminDashboardScreen from './screens/LeadAdminDashboardScreen';
import OrderDetailsScreen from './screens/OrderDetailsScreen';
import BezAdmina from './components/BezAdmina.tsx';
import logo from './logo_2.png';
import AddProductScreen from './screens/AddProductScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store1);
  const { cart, userInfo } = state;
  const url = window.location.pathname;
  console.log(url);
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_LOGOUT' });
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
    localStorage.removeItem('paymentMethod');
  };


  // const [sideberIsOpen,setSidebarIsOpen]=useState(false);
  //const [categories,setCategories]=useState([]);

 
  return (
    <BrowserRouter>
      <div>
        <header>
          <Navbar expand="lg fixed-top">
            <Container>
              
              <LinkContainer to="/">
                <Navbar.Brand className="logo">
                  <img src={logo} alt="Logo" />
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav " />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto w-100 justify-content-end">
                  {userInfo && userInfo.data?.user.role === 'user' && (
                    <Link to="/cart" className="korpica">
                      <i className="fa fa-shopping-cart"></i> Korpa
                      {/* 🛒 */}
                      {cart.cartItems.length > 0 && (
                        <Badge pill>
                          {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                        </Badge>
                      )}
                    </Link>
                  )}

                  {!userInfo && (
                    <Link className="nav-link" to="/login">
                      <i className="fa fa-user ikonica">
                        {' '}
                        <h5> ㅤ Prijavi se</h5>
                      </i>
                    </Link>
                  )}

                  {userInfo && userInfo.data?.user.role === 'user' && (
                    <>
                    <div className="ikonicaaaaaa">
                      <NavDropdown 
                        
                        style={{color:'white'}}
                        title={userInfo.data?.user.name}
                        id="basic-nav-dropdown"
                      >
                       
                        <LinkContainer to="/user">
                          <NavDropdown.Item>
                            <i className="fa fa-user"></i> Profil
                          </NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/orderhistory">
                          <NavDropdown.Item>
                            <i className="fa fa-history"></i> Vaše kupovine
                          </NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/maps">
                          <NavDropdown.Item>
                            <i className="fa fa-map"></i> Mape
                          </NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/help">
                          <NavDropdown.Item>
                            <i className="fa fa-question"></i> Pomoć
                          </NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        <Link
                          className="dropdown-item"
                          to="#signout"
                          onClick={signoutHandler}
                        >
                          <i className="fa fa-logout"></i>
                          Odjavite se
                        </Link>
                      </NavDropdown>
                      <i className="fa fa-user ikonica"></i>
                      </div>
                    </>
                  )}

                  {userInfo && userInfo.data?.user.role === 'store-admin' && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>
                          <i className="fas fa-chart-bar"></i> Statistika
                        </NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>
                          <i className="fa fa-shopping-bag"></i> Proizvodi
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>
                          <i className="fa fa-list-ol"></i> Narudžbine
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/user">
                        <NavDropdown.Item>
                          <i className="fa fa-user"></i> Profil
                        </NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Odjavite se
                      </Link>
                    </NavDropdown>
                  )}

                  {userInfo && userInfo.data?.user.role === 'lead-admin' && (
                    <NavDropdown title="LeadAdmin" id="leadadmin-nav-dropdown">
                      <LinkContainer to="/leadadmin/dashboard">
                        <NavDropdown.Item>
                          <i className="fas fa-chart-bar "></i> Statistika
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/leadadmin/stores">
                        <NavDropdown.Item>
                          <i className="fa fa-list"></i> Lista Prodavnica
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/leadadmin/users">
                        <NavDropdown.Item>
                          <i className="fa fa-list-ol"></i> Lista Korisnika
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/leadadmin/profil">
                        <NavDropdown.Item>
                          <i className="fa fa-user"></i> Profil
                        </NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Odjavite se
                      </Link>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
       
        <div>
          <main>
            <Container>
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/store/:id" element={<StoreScreen />} />
                <Route path="/product/:name" element={<ProductScreen />} />
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/InputMail" element={<InputMailScreen />} />
                <Route path="/InputSifra/:id" element={<InputSifraScreen />} />
                <Route
                  path="/user"
                  element={
                    <Protected>
                      <UserScreen />
                    </Protected>
                  }
                />
                <Route path="/search" element={<SearchScreen />} />
                <Route path="/signin" element={<SigninScreen />} />
                <Route path="/placeorder" element={<PlaceOrderScreen />} />
                <Route
                  path="/orderhistory"
                  element={
                    <Protected>
                      <BezAdmina>
                        <OrderScreen />
                      </BezAdmina>
                    </Protected>
                  }
                />
                <Route path="/maps" element={<MapScreen />} />
                <Route path="/help" element={<HelpScreen />} />
                <Route
                  path="/searchproduct/:id"
                  element={<SearchProductsScreen />}
                />
                <Route
                  path="/neuspeh"
                  element={
                    <Protected>
                      <BezAdmina>
                        <NeuspehScreen />
                      </BezAdmina>
                    </Protected>
                  }
                />
                {/* /Admin*/}
                <Route
                  path="/admin/dashboard"
                  element={
                    <Admin>
                      <DashboardScreen></DashboardScreen>
                    </Admin>
                  }
                />
                <Route
                  path="/admin/user"
                  element={
                    <Admin>
                      <UserScreen />
                    </Admin>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <Admin>
                      <ProductListScreen />
                    </Admin>
                  }
                />
                <Route
                  path="/admin/product/:id"
                  element={
                    <Admin>
                      <ProductEditScreen />
                    </Admin>
                  }
                ></Route>
                <Route
                  path="/admin/createproduct"
                  element={
                    <Admin>
                      <AddProductScreen />
                    </Admin>
                  }
                ></Route>
                <Route
                  path="/admin/orders"
                  element={
                    <Admin>
                      <OrderListScreen />
                    </Admin>
                  }
                ></Route>
                <Route
                  path="/admin/order/:id"
                  element={
                    <Admin>
                      <OrderDetailsScreen />
                    </Admin>
                  }
                />

                {/*LeadAdmin*/}
                <Route
                  path="/leadadmin/dashboard"
                  element={
                    <LeadAdmin>
                      <LeadAdminDashboardScreen></LeadAdminDashboardScreen>
                    </LeadAdmin>
                  }
                />
                <Route
                  path="/leadadmin/users"
                  element={
                    <LeadAdmin>
                      <UserListScreen />
                    </LeadAdmin>
                  }
                ></Route>
                <Route
                  path="/leadadmin/profil"
                  element={
                    <LeadAdmin>
                      <UserScreen />
                    </LeadAdmin>
                  }
                />
                <Route
                  path="/leadadmin/user/:id"
                  element={
                    <LeadAdmin>
                      <UserEditScreen />
                    </LeadAdmin>
                  }
                ></Route>
                <Route
                  path="/leadadmin/stores"
                  element={
                    <LeadAdmin>
                      <StoreListScreen />
                    </LeadAdmin>
                  }
                ></Route>
                <Route
                  path="/leadadmin/stores/:id"
                  element={
                    <LeadAdmin>
                      <StoreEditScreen />
                    </LeadAdmin>
                  }
                ></Route>
                <Route
                  path="/leadadmin/addstore"
                  element={
                    <LeadAdmin>
                      <AddStoreScreen />
                    </LeadAdmin>
                  }
                ></Route>
              </Routes>
            </Container>
          </main>
        </div>
        {/*  <footer>
          <div className="text-center text-muted ">All rights reserved</div>
        </footer> */}
        <Box>
          {/* <h1 style={{ color: "orange", 
                   textAlign: "center", 
                   marginTop: "-50px" }}>
        MERKUR: Efikasno Resava Kupovinu U Radnjama
      </h1> */}
          <Container>
            <Row>
              <Column>
                <Heading>O nama</Heading>
                <FooterLink href="/help">Aplikacija</FooterLink>
                <FooterLink href="/help">Cilj</FooterLink>
                <FooterLink href="/help">Vizija</FooterLink>
              </Column>
              <Column>
                <Heading>Usluge</Heading>
                <FooterLink href="/login">Kreiranje naloga</FooterLink>
                <FooterLink href="#">Kupovina</FooterLink>
                <FooterLink href="/cart">Plaćanje</FooterLink>
              </Column>
              <Column>
                <Heading>Kontaktirajte nas</Heading>
                <FooterLink href="/help">MERKUR</FooterLink>
                
              </Column>
              <Column>
                <Heading>Društvene mreže</Heading>
                <FooterLink href="/help">
                  <i className="fab fa-facebook-f">
                    <span style={{ marginLeft: '10px' }}>Facebook</span>
                  </i>
                </FooterLink>
                <FooterLink href="/help">
                  <i className="fab fa-instagram">
                    <span style={{ marginLeft: '10px' }}>Instagram</span>
                  </i>
                </FooterLink>
                <FooterLink href="/help">
                  <i className="fab fa-twitter">
                    <span style={{ marginLeft: '10px' }}>Twitter</span>
                  </i>
                </FooterLink>
                <FooterLink href="/help">
                  <i className="fab fa-youtube">
                    <span style={{ marginLeft: '10px' }}>Youtube</span>
                  </i>
                </FooterLink>
              </Column>
            </Row>
          </Container>
        </Box>
        {/*</div>
  </div>
   */}
      </div>
      <ToastContainer position="bottom-center" limit={1} />
    </BrowserRouter>
  );
}

export default App;
