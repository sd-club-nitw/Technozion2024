import React, { useState, useEffect } from "react";
import SponsorItem from "./SponsorItem";
import Loader from "../Loader";
import './index.css';


function RenderSponsors() {
	const [loading, setLoading] = useState(true);
	const [spons, setSpons] = useState([]);
	useEffect(() => {
		const getSpons = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/sponsor`, { method: "GET" });
			if (response.status !== 200) return;

			const details = await response.json();
			console.log("details", details);
			setSpons(details);
			setLoading(false);
		}

		getSpons();
	}, [])

	const renderSponsors = () => {
		console.log(spons);

		return spons?.map((data, index) => {
			const { name, link, type, photo } = data;
			return (
				<div className="sss" key={index}>
					<SponsorItem
						alt={name}
						name={name}
						src={photo}
						title={type}
						link={link}
					/>
				</div>
			);
		});
	};

	return (
		<div>
			{loading ? <Loader /> : ""}
			<div className='bg-[#0E0E0E] text-[#F7CA17] pt-[100px] text-center flex'>
				<h1 className="sponsors-hero-title text-4xl font-[800] text-bolder mx-auto flex justify-start items-center text-center">SPONSORS</h1>
			</div>
			<div className="row sponscont sm:p-4 md:px-12">
				{renderSponsors()}
			</div>
		</div>
	);
}

export default RenderSponsors;

