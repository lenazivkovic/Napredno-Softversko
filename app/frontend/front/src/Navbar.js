import { Link } from "react-router-dom";

function NavBar(){
  
    return(
        <div>
           <nav className="navbar navbar-light  fixed-top navbar-style">
            <div className="container-fluid">

            <Link className="navbar-brand" to="/">MERKUR</Link>
            


           <Link className="navbar-brand " to="/#">Korpa</Link>

                
          
            <Link className="navbar-brand " to="/#">Sign up/log in</Link>

 

            <form className="d-flex">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
            <button className="btn btn-outline-success " type="submit">Search</button>
            </form>
        
          <button className="navbar-toggler " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-cddddddontrols="offcanvasNavbar">
          <span className="navbar-toggler-icon "></span>
          </button>

                
                 <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                 <div className="offcanvas-header">
                 <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
                 <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>

            
                 </div>
            
             
      <div className="offcanvas-body">
        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
      
          <li className="nav-item">
            <Link className="nav-link" to="/#">Prodavnice</Link>
          </li>
          <li className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle" to="#" id="offcanvasNavbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Hrana
            </Link>
            <ul className="dropdown-menu" aria-labelledby="offcanvasNavbarDropdown">
              <li><Link className="dropdown-item" to="/#">Voće</Link></li>
              <li><Link className="dropdown-item" to="/#">Povrće</Link></li>
              <li><Link className="dropdown-item" to="/#">Meso</Link></li>
              <li><Link className="dropdown-item" to="/#">Mlečni proizvodi</Link></li>
              <li><Link className="dropdown-item" to="/#">Grickalice</Link></li>
              <li><Link className="dropdown-item" to="/#">Slatkiši</Link></li>

              <li>
                <hr className="dropdown-divider"></hr>
              </li>
            
            </ul>
          </li>
          <li className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle" to="#" id="offcanvasNavbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Piće
            </Link>
            <ul className="dropdown-menu" aria-labelledby="offcanvasNavbarDropdown">
              <li><Link className="dropdown-item" to="/#">Voda</Link></li>
              <li><Link className="dropdown-item" to="/#">Mineralna voda</Link></li>
              <li><Link className="dropdown-item" to="/#">Sokovi</Link></li>
              <li><Link className="dropdown-item" to="/#">Alkoholna pića</Link></li>
              <li><Link className="dropdown-item" to="/#">Grickalice</Link></li>
              <li><Link className="dropdown-item" to="/#">Slatkiši</Link></li>
              <li>
                <hr className="dropdown-divider"></hr>
              </li>
            
            </ul>
          </li>
          <li className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle" to="#" id="offcanvasNavbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Odeca
            </Link>
            <ul className="dropdown-menu" aria-labelledby="offcanvasNavbarDropdown">
              {/* <li><a className="dropdown-item" to="/#">Action</a></li>
              <li><a className="dropdown-item" to="/#">Another action</a></li> */}
              <li>
                <hr className="dropdown-divider"></hr>
              </li>
            
            </ul>
          </li>
          <li className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle" to="#" id="offcanvasNavbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Obuća
            </Link>
            <ul className="dropdown-menu" aria-labelledby="offcanvasNavbarDropdown">
           {/*    <li><a className="dropdown-item" to="/#">Action</Link></li>
              <li><a className="dropdown-item" to="/#">Another action</Link></li> */}
              <li>
                <hr className="dropdown-divider"></hr>
              </li>
            
            </ul>
          </li>
          <li className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle" to="#" id="offcanvasNavbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Tehnika
            </Link>
            <ul className="dropdown-menu" aria-labelledby="offcanvasNavbarDropdown">
             {/*  <li><a className="dropdown-item" to="/#">Action</Link></li>
              <li><a className="dropdown-item" to="/#">Another action</Link></li> */}
              <li>
                <hr className="dropdown-divider"></hr>
              </li>
            
            </ul>
          </li>
          <li className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle" to="#" id="offcanvasNavbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Kućni ljubimci
            </Link>
            <ul className="dropdown-menu" aria-labelledby="offcanvasNavbarDropdown">
             {/*  <li><a className="dropdown-item" to="/#">Action</Link></li>
              <li><a className="dropdown-item" to="/#">Another action</Link></li> */}
              <li>
                <hr className="dropdown-divider"></hr>
              </li>
            
            </ul>
          </li>


        </ul>
       
      </div>
    </div>
  </div>

        </nav>
    </div>

        );

}
export default NavBar;