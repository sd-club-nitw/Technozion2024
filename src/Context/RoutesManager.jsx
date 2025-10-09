import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { About } from '../components/About';
import Events from '../components/Events';
import { Displayevents } from '../components/DisplayEvents';
import AuthPage from '../components/Authpage/AuthPage';
import Home from '../components/Home';
import Sponsors from '../components/Sponsors/Sponsors';
import { useAuth } from './AuthManager';
import  Register  from '../components/Register2/Register.jsx';
import { Gallery } from '../components/Gallery/gallery.js';
import { Team } from '../components/Team/team.jsx';
import Card from '../components/card/card.jsx';
import Index from '../components/event_scroll/index.js';
import { ComingSoon } from "../components/ComingSoon/ComingSoon.jsx";
import Payment from '../components/Payment/Payment.jsx';

const ProtectedRoute = ({ children }) => {
	const { user } = useAuth();
	if (!user) {
		return <Navigate to="/auth" replace />;
	}
	return children;
};

const RoutesManager = () => {
	const location = useLocation();
	window.scroll(0, 0);

	return (
		<Routes>
			<Route path="/auth" element={<AuthPage />} />

			<Route path="/" element={<Home />} />
			<Route path='/payment' element={<Payment/>}></Route>

			{/* Example of protected routes */}
			<Route
				path="/events"
				element={
					<ProtectedRoute>
						<Events />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/auth/register"
				element={
						<Register />
				}
			/>
			<Route
				path="/gallery"
				element={
					<ProtectedRoute>
						<Gallery />
					</ProtectedRoute>
				}
			/>

			{/* Catch all */}
			<Route path="*" element={<ComingSoon />} />
			<Route path="/about" element={<About />} />
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

