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
  { name: "SCHEDULE", link: "/gallery" },
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
const SCROLL_THRESHOLD = 5;
  useEffect(() => {
        const navbar = document.getElementById('mainNavbar');
        
        if (!navbar) {
            // Log an error if the navbar element isn't found
            console.error("Navbar element with ID 'mainNavbar' not found.");
            return;
        }

        // --- 1. Define the Scroll Handler Function ---
        const handleScroll = () => {
            // window.scrollY is used to get the vertical scroll position
            if (window.scrollY > SCROLL_THRESHOLD) {
              console.log('crossed threshold')
                // Add the 'scrolled' class if the scroll position is past the threshold
                navbar.classList.add('scrolled');
            } else {
              console.log('didnt reach')
                // Remove the 'scrolled' class if the user scrolls back up
                navbar.classList.remove('scrolled');
            }
        };

        // --- 2. Attach the Listener on Mount ---
        window.addEventListener('scroll', handleScroll);
        
        // Run the check once immediately on mount to handle reloads
        handleScroll();

        // --- 3. Clean Up the Listener on Unmount ---
        // The return function runs when the component unmounts (cleanup)
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
        
    // The empty dependency array (`[]`) ensures this effect runs only once after the initial render.
    }, []);

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
     <NavLink to={menuItem.link} onClick={closeMenu} className="nav-btn w-[6rem]">
  <span>{menuItem.name}</span>
</NavLink>
      )}
    </li>
  ));

  const rightNavItems = rightNavigation.map((menuItem, index) => (
    <li key={index}>
       <NavLink to={menuItem.link} onClick={closeMenu} className="nav-btn w-[6rem]">
  <span>{menuItem.name}</span>
</NavLink>
    </li>
  ));

  return (
    <div id="mainNavbar" className='nav-wrapper z-30'>
      {/* 5. Conditional background from previous fix */}
      {!menuOpen && isRegisterPage && <div className="navbar-background"></div>}

      {!menuOpen ? (
        <div className="logo z-40 w-fit bg-red-500" > 
          <Link to="./" onClick={closeMenu}>
            <img src={chota_logo} alt="logo1" />
          </Link>
        </div> 
      ) : null}

      <nav className={`z-40 ${menuOpen ? 'menu-open' : 'menu-closed'}`}>
        <div
          className="menu z-50"
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
        >
       {/* span 1 top bar  */}
        <span className={`ham bg-white ${menuOpen ? 'open-top' : ''}`}></span>

        {/* Span 2 (Middle Bar) */}
        <span className={`ham bg-lightPurple w-1/2 ${menuOpen ? 'open-middle' : ''}`}></span>

          {/* Span 3 (Bottom Bar) */}
          <span className={`ham bg-white ${menuOpen ? 'open-bottom' : ''}`}></span>
        
         
        </div>
        <ul className={`z-40 ${menuOpen ? "open" : ""}`}>{listItems}</ul>
      </nav>

      {/* Right side navbar only appears on larger screens */}
      {!isMobileView && (
        <nav className="z-40 right-nav">
          <ul>{rightNavItems}</ul>
        </nav>
      )}
    </div>
  );
}