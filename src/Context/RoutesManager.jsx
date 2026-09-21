import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { About } from '../components/About';
import Events from '../components/Events';
import { Displayevents } from '../components/DisplayEvents';
import Home from '../components/Home';
import Sponsors from '../components/Sponsors/Sponsors';
import { Gallery } from '../components/Gallery/gallery.js';
import { Team } from '../components/Team/team.jsx';
import Card from '../components/card/card.jsx';
import Index from '../components/event_scroll/index.js';
import PastEvents from '../components/PastEvents/PastEvents.jsx';
import { ComingSoon } from "../components/ComingSoon/ComingSoon.jsx";

const RoutesManager = () => {
	const location = useLocation();
	window.scroll(0, 0);

	return (
		<Routes>
			<Route path="/auth" element={<ComingSoon />} />

			<Route path="/" element={<Home />} />

			{/* Example of protected routes */}

			<Route
				path="/auth/register"
				element={
						<ComingSoon />
				}
			/>

			{/* Registration coming soon */}
			<Route path="/register" element={<ComingSoon />} />
			<Route path="/about" element={<About />} />
			{/* <Route path="/sponsors" element={<Sponsors />} /> */}
			<Route path="/events" element={<PastEvents />} />
			<Route path="/events/:year" element={<PastEvents />} />
			{/* <Route path="/displayevents" element={<Displayevents />} /> */}
			<Route path="/team" element={<Team />} />
			{/* <Route path="/gallery" element={<Gallery />} /> */}
			{/* <Route path="/index" element={<Index />} /> */}
			<Route path="/card" element={<Card />} />
			<Route path="*" element={<ComingSoon />} />

		</Routes>
	);
};

export default RoutesManager;

