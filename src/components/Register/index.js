import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Promocode } from "./Promocode";
import { useAuth } from "../../Context/AuthManager";
import displayRazorpay from "../../Context/PaymentManager";
// import Loader from "../Loader";

export const Register = () => {
	const { user, setLoading } = useAuth()
	let navigate = useNavigate()
	const userObj = JSON.parse(user);
	const [amount, setAmount] = useState(0);
	// const [code, setCode] = useState('');
	const [formData, setFormData] = useState({
		email: userObj.user.email,
		name: userObj.user.firstName + userObj.user.lastName,
		phoneNumber: "0",
		college: "0",
		level: "0",
		referralId: '',
		accomDay0: false,
		accomDay1: false,
		accomDay2: false,
		accomDay3: false,
		proshowDay1: false,
		proshowDay2: false,
		proshowDay3: false,
		reg: false,
		gender: "",
		code: ''
	});
	const [fdHistory, setFdHistory] = useState(formData);

	const details = async () => {
		const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${userObj.user.email}`, { method: "GET" })
		if (response.status !== 200) return;
		const { details } = await response.json()
		const fd = {
			email: userObj.user.email,
			name: userObj.user.firstName + " " + userObj.user.lastName,
			phoneNumber: details?.mobile,
			college: details?.college,
			level: details?.level,
			referralId: details?.referralId,
			accomDay0: details?.paidForAccomodationDay0,
			accomDay1: details?.paidForAccomodationDay1,
			accomDay2: details?.paidForAccomodationDay2,
			accomDay3: details?.paidForAccomodationDay3,
			reg: details?.paidForRegDay1 || details?.paidForRegDay2 || details?.paidForRegDay3,
			proshowDay1: details?.paidForProshow1,
			proshowDay2: details?.paidForProshow2,
			proshowDay3: details?.paidForProshow3,
			gender: details?.gender,
			code: '',

		}
		setFdHistory(fd);
		setFormData(fd);
	}

	useEffect(() => {
		details()
		setAmount(calculatePrice())
		return
	}, [calculatePrice, details])
	const accomDays = [fdHistory.accomDay0, fdHistory.accomDay1, fdHistory.accomDay2, fdHistory.accomDay3];
	const proshowDays = [fdHistory.proshowDay1, fdHistory.proshowDay2, fdHistory.proshowDay3];
	const proshowArtists = ["Anurag Halder + Saketh", "Costheta Band + Aseem Sharma (Acoustic Live) + DJ Vanmoon", "Mohan Sisters Live + DJ Swattrex"];
	const calculatePrice = () => {
		let regAmount = fdHistory.reg ? 0 : 350;

		let accomAmount = 0;
		accomDays.forEach((val, i) => {
			if (!val) {
				accomAmount += (formData['accomDay' + (i)]) ? 250 : 0;
			}
		});

		let proshowAmount = 0;
		proshowAmount += proshowDays[0] ? 0 : (formData['proshowDay1'] ? 500 : 0);
		proshowAmount += proshowDays[1] ? 0 : (formData['proshowDay2'] ? 500 : 0);
		proshowAmount += proshowDays[2] ? 0 : (formData['proshowDay3'] ? 700 : 0);

		if (proshowAmount === 1700) proshowAmount -= 200;

		if (formData.code !== undefined && formData.code !== '') {
			// value is in percentage
			return (regAmount + accomAmount + proshowAmount) - ((regAmount + accomAmount + proshowAmount) * (formData.code.value / 100));
		}
		return regAmount + accomAmount + proshowAmount;
	}
	const handleCheckBoxChange = (e) => {
		setFormData({ ...formData, [e.target.id]: !formData[e.target.id] });
	}

	const handleTextChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		formData.reg = true;
		if (formData.phoneNumber === "0" || formData.college === "0") {
			alert("Please fill all the details");
			return;
		}
		const confirmation = await displayRazorpay(setLoading, userObj, formData)
		if (!confirmation.paymentSuccess) alert("Something went wrong , if money is deducted from account please contact us")
		navigate('/profile')
	}

	const handleDropdownChange = (e) => {
		// e.preventDefault();
		setFormData({ ...formData, [e.target.id]: e.target.value });
	}
	useEffect(() => {
		setAmount(calculatePrice())
	}, [formData])
	const allComplete = () => {
		let flag = fdHistory.reg;
		for (let i = 1; i <= 3; i++) {
			if (!fdHistory['accomDay' + i]) {
				flag = false;
				break;
			}
		}
		for (let i = 1; i <= 3; i++) {
			if (!fdHistory['proshowDay' + i]) {
				flag = false;
				break;
			}
		}
		return flag;
	}
	// const applyPromo = async ({ code, value }) => {
	// 	const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${userObj.user.email}`, { method: "GET" })
	// 	if (response.status === 200) {
	// 		const { details } = await response.json()
	// 		if (details?.codes.includes(code)) {
	// 			alert('Code can be used once per user');
	// 			setCode('');
	// 			return;
	// 		}
	// 	}
	// 	setFormData({ ...formData, code: { code, value } });
	// 	setAmount(amount - (amount * value / 100));
	// 	setCode('Applied');
	// }

	return !allComplete() ? (
		<div className="min-h-screen overflow-y-auto flex items-center justify-center bg-black">
			<section className="max-w-4xl mx-2 p-6 lg:mx-auto bg-gray rounded-md shadow-md mt-20 mb-20">
				<h1 className="text-xl font-bold text-white capitalize dark:text-white">Registration Form</h1>
				<form >
					<div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
						<div>
							<label className="text-white dark:text-gray-200" for="username">Name:</label>
							<input disabled={true} id="name" type="text" value={formData.name} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
						</div>

						<div>
							<label className="text-white dark:text-gray-200" for="emailAddress">Email Address:</label>
							<input disabled={true} id="emailAddress" value={formData.email} type="email" className="block w-full px-4 py-2 mt-2 text-black bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
						</div>

						<div>
							<label className="text-white dark:text-gray-200" for="phoneNumber">Phone Number:</label>
							<input required={true} onChange={handleTextChange} placeholder="Contact Number" id="phoneNumber" type="tel" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
						</div>

						<div>
							<label className="text-white dark:text-gray-200" for="college">College:</label>
							<input required={true} id="college" onChange={handleTextChange} placeholder="College Name" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
						</div>

						<div className='text-white'>
							<label for="gender">Gender:</label>
							<br />
							<select id="gender" onChange={handleDropdownChange} name="gender" className="w-full px-4 py-2 mt-2 text-black bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
								<option value="female">F</option>
								<option value="male">M</option>
								<option value="others">Others</option>
								<option value="NA">Prefer not to say</option>

							</select>
						</div>
						{/* 
            <div>
              <label className="text-white dark:text-gray-200" for="username">Referral Code:</label>
              <input id="referralId" type="text" placeholder="Optional" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
            </div> */}
						<div>
							<h2 className="text-white dark:text-gray-200 mb-2">Registration:</h2>
							{!fdHistory.reg ? <><div className="text-white">Fee : <button className="px-6 py-2 bg-[#F7CA17] rounded-md font-bold" disabled={true}>₹350/-</button></div>
								<p className="text-sm text-white"><span className="text-[#BA1717]">*</span>This fee is compulsory to register for other events in the spree.</p>
							</> :
								<div className="text-white text-sm"><span className="text-[#00FF00]">*</span>Congratulations, You are registered for the SpringSpree. Now, you can register for other events and accomodation.</div>
							}
							<p></p>
						</div>
						<div>
							<h2 className="text-white dark:text-gray-200 mb-2">Food & Accomodation:</h2>
							{accomDays.map((day, index) => {
								console.log(day, index);
								if (day)
									return null;
								return (
									<div key={index} className="text-white dark:text-gray-200">
										<input
											className="text-white dark:text-gray-200 relative float-left mt-[0.15rem] mr-[6px]  h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 dark:border-neutral-600 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary dark:checked:border-primary checked:bg-primary dark:checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:ml-[0.25rem] checked:after:-mt-px checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:ml-[0.25rem] checked:focus:after:-mt-px checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-t-0 checked:focus:after:border-l-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent"
											type="checkbox"
											value=""
											id={"accomDay" + (index)}
											onChange={handleCheckBoxChange}
											checked={formData['accomDay' + (index)]}
											disabled={fdHistory['accomDay' + (index)]}
										/>
										<label
											className="inline-block pl-[0.15rem] hover:cursor-pointer"
											htmlFor={"accomDay" + (index)} >
											April {(index + 6)} <sup> th </sup>
										</label>
									</div>
								)
							})}
						</div>
					</div>
					<div className="mt-6">
						<h2 className="text-white dark:text-gray-200 mb-2">Pro Shows:</h2>
						{proshowDays.map((day, index) => {
							if (day) return null;
							return (
								<div key={index} className="text-white dark:text-gray-200">
									<input
										className="text-white dark:text-gray-200 relative float-left mt-[0.15rem] mr-[6px]  h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 dark:border-neutral-600 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary dark:checked:border-primary checked:bg-primary dark:checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:ml-[0.25rem] checked:after:-mt-px checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:ml-[0.25rem] checked:focus:after:-mt-px checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-t-0 checked:focus:after:border-l-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent"
										type="checkbox"
										value=""
										id={"proshowDay" + (index + 1)}
										onChange={handleCheckBoxChange}
										checked={formData['proshowDay' + (index + 1)]}
										disabled={fdHistory['proshowDay' + (index + 1)]}
									/>
									<label
										className="inline-block pl-[0.15rem] hover:cursor-pointer"
										for={"proshowDay" + (index + 1)} >
										April {(index + 7)} <sup> th </sup> - ({proshowArtists[index]})
									</label>
								</div>
							)
						})}
						{!(proshowDays[0] || proshowDays[1] || proshowDays[2]) ? <p className="text-white text-sm mt-2"><span className="text-[#BA1717]">*</span> Paying for all three days at a time will get you ₹200 discount</p> : null}
					</div>
					{/* <Promocode code={code} setCode={setCode} applyPromo={applyPromo} placeholder="Promo" /> */}

					{amount === 350 ? (<div className="flex justify-center mt-6">
						<button onClick={handleSubmit} className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray rounded-md hover:bg-pink-700 focus:outline-none focus:bg-gray-600" disabled={amount === 0} >Pay Registration Fee Rs. 350</button>
					</div>) : (<div className="flex justify-center mt-6">
						<button onClick={handleSubmit} className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray rounded-md hover:bg-pink-700 focus:outline-none focus:bg-gray-600" disabled={amount === 0} >{amount === 0 ? `Select atleast 1 day` : `Pay Rs. ${amount}`}</button>
					</div>)}

					<p className="text-sm text-white mt-4 "><span className='text-[#BC1717] font-bold'>* </span>In case of any issues please mail to springspree@nitw.ac.in </p>
				</form>
			</section>
		</div >
	) :
		(
			<div className="min-h-screen overflow-y-auto flex items-center justify-center bg-black">
				<section className="max-w-4xl p-6 mx-auto bg-gray rounded-md shadow-md mt-20 mb-20">
					<h1 className="text-xl font-bold text-white capitalize dark:text-white">Congratulations You have registered for all days</h1>
					{/* button to redirect to profile page */}
					<div className="flex justify-center mt-6">
						<button className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray rounded-md hover:bg-pink-700 focus:outline-none focus:bg-gray-600" onClick={navigate('/profile')} >Go to Profile</button>
					</div>
				</section>
			</div>
		)
}