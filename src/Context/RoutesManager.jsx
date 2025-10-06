import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { About } from '../components/About';
import   Events   from '../components/Events';
import { Displayevents } from '../components/DisplayEvents';
import AuthPage from '../components/Authpage/AuthPage';
import Home from '../components/Home';
import Sponsors from '../components/Sponsors/Sponsors';
import { useAuth } from './AuthManager';
// import { Register } from '../components/Register';
import { Register } from '../components/Register1/register.js';
import { Gallery } from '../components/Gallery/gallery.js';
import { Team } from '../components/Team/team.jsx';
import { useLocation } from 'react-router-dom';
import Card from '../components/card/card.jsx';

import Index from '../components/event_scroll/index.js';
import { ComingSoon } from "../components/ComingSoon/ComingSoon.jsx";

const RoutesManager = () => {
	const { user } = useAuth();
	const location = useLocation();
	window.scroll(0,0);
	return (
		<Routes>
			{!user ? (
				<>
					{/* <Route path="/auth" element={<AuthPage />} /> */}
					{/* <Route path="/register" element={<AuthPage />} /> */}
				</>
			) : (
				<>
					{/* <Route path="/auth" element={<Register />} /> */}
					{/* <Route path="/register" element={<Register />} /> */}
				</>
			)}

			<Route path="/" element={<Home />} />
			<Route path="*" element={<ComingSoon />} />
			{/* <Route path="/about" element={<About />} /> */}
			{/* <Route path="/sponsors" element={<Sponsors />} /> */}
			<Route path="/events" element={<Index />} />
			{/* <Route path="/displayevents" element={<Displayevents />} /> */}
			<Route path="/team" element={<Team />} />
			{/* <Route path="/register" element={<Register />} /> */}
			{/* <Route path="/gallery" element={<Gallery />} /> */}
			{/* <Route path="/index" element={<Index />} /> */}
			<Route path="/card" element={<Card />} /> Route for the card component

			
		</Routes>
	);
};
export default RoutesManager;
