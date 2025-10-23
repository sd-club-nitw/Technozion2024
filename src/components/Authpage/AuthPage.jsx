import React from "react"
import "./index.css"
import rasengan from "./Rasengan.png"
import { useNavigate } from "react-router-dom"

const AuthPage = () => {
	const navigate = useNavigate();
	function handleButtonClick() {
		navigate('/auth/register')
	}

	return (
		<div className="flex h-screen flex-col justify-center items-center bg-black relative">
			{/* Top Rasengan Image */}
			<img
				className="rasenganIMG absolute top-5 z-10"
				src={rasengan}
				alt="rasengan"
			/>

			{/* Rasengan Animation */}
			<div id="R" className="rasengan">
				{Array.from({ length: 100 }).map((_, i) => (
					<div key={i} className={`line line${i + 1} `} />
				))}
			</div>

			{/* Register Button */}
			<div id="regi" className="main flex justify-center z-20 mt-96">
				<button className="btn35" onClick={handleButtonClick}>
					<span>Register</span>
				</button>
			</div>
		</div>
	)
}

export default AuthPage
