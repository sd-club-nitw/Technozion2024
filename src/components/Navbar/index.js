import React, { useState, useEffect } from "react";
// 1. IMPORT useLocation
import { NavLink, Link, useLocation } from "react-router-dom";
import { ImCross } from "react-icons/im";
import chota_logo from "./logo-03.png";
import './index.css';

const oldNavigation = [
  { name: "HOME", link: "/" },
  { name: "ABOUT", link: "/about" },
  { name: "EVENTS", link: "/events" },
  // If you want the dropdown to appear, add:
  // { name: "REVENTS", link: "#" } 
];

const rightNavigation = [
  { name: "GALLERY", link: "/gallery" },
  { name: "TEAM", link: "/team" },
  { name: "REGISTER", link: "/auth/register" },
];

const dropList = [
  { name: "List1", link: "/l1" },
  { name: "List2", link: "/l2" },
  { name: "List3", link: "/l3" },
];

export default function Navbar() {
  const [navigation, setNavigation] = useState(oldNavigation);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 725);
  const [showDropdown, setShowDropdown] = useState(false);

  // 2. GET CURRENT LOCATION
  const location = useLocation();
  const isRegisterPage = location.pathname === '/auth/register';

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 725);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobileView) {
      
      setNavigation([...oldNavigation, ...rightNavigation]);
    } else {
     
      setNavigation(oldNavigation);
    }
  }, [isMobileView]);

  const closeMenu = () => {
    setMenuOpen(false);
    setShowDropdown(false);
  };

  // 3. (FIX) REMOVED 'e' and 'e.preventDefault()'
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const listItems = navigation.map((menuItem, index) => (
    <li key={index}>
      {menuItem.name === "REVENTS" ? (
        <div className="dropdown2-trigger">
          {/* 4. (FIX) CHANGED <a> to <button>
            - Added type="button"
            - Added className="nav-button-link" for styling
          */}
          <button 
            onClick={toggleDropdown} 
            className="nav-button-link" 
            type="button"
          >
            {menuItem.name}
          </button>
          {showDropdown && (
            <ul className="dropdown2">
              {dropList.map((dropItem, idx) => (
                <li key={idx}>
                  <NavLink to={dropItem.link} onClick={closeMenu}>
                    {dropItem.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
     <NavLink to={menuItem.link} onClick={closeMenu} className="nav-btn">
  <span>{menuItem.name}</span>
</NavLink>
      )}
    </li>
  ));

  const rightNavItems = rightNavigation.map((menuItem, index) => (
    <li key={index}>
       <NavLink to={menuItem.link} onClick={closeMenu} className="nav-btn">
  <span>{menuItem.name}</span>
</NavLink>
    </li>
  ));

  return (
    <>
      {/* 5. Conditional background from previous fix */}
      {!menuOpen && isRegisterPage && <div className="navbar-background"></div>}

      {!menuOpen ? (
        <div className="logo" > 
          <Link to="./" onClick={closeMenu}>
            <img src={chota_logo} alt="logo1" />
          </Link>
        </div> 
      ) : null}

      <nav className={menuOpen ? 'menu-open' : 'menu-closed'}>
        <div
          className="menu"
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
        >
          {menuOpen ? (
            <ImCross className='cross' />
          ) : (
            <>
              <span className={menuOpen ? '' : 'ham'}></span>
              <span className={menuOpen ? '' : 'ham'}></span>
              <span className={menuOpen ? '' : 'ham'}></span>
            </>
          )}
        </div>
        <ul className={menuOpen ? "open" : ""}>{listItems}</ul>
      </nav>

      {/* Right side navbar only appears on larger screens */}
      {!isMobileView && (
        <nav className="right-nav">
          <ul>{rightNavItems}</ul>
        </nav>
      )}
    </>
  );
}