import React from 'react'

export const Promocode = ({ code, setCode, applyPromo }) => {
    const handleClick = async (e) => {
        e.preventDefault();
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/checkValidity`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ promo: code }) })
        const data = await res.json();
        if (data.valid !== 1) {
            alert(data.message);
        }
        else {
            await applyPromo({ code, value: data.value });
        }
    }
    const handleTextChange = (e) => {
        setCode(e.target.value)
    }
    return (
        <div className="">
            <div className="grid grid-cols-1 mt-4 md:grid-cols-2">
                <div>
                    <label className="text-white dark:text-gray-200" for="promo">Promo Code</label>
                    <input id="promo" type="text" onChange={handleTextChange} value={code} disabled={(code === 'Applied')} placeholder='Optional' className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                </div>
                <div className="flex justify-left mt-6">
                    <button className="md:ml-4 px-4 py-2 h-10 text-white transition-colors duration-200 transform bg-gray rounded-md hover:bg-pink-700 focus:outline-none focus:bg-gray-600 self-end disabled:hidden" disabled={code === '' || code === 'Applied'} onClick={handleClick} >Check</button>
                </div>
            </div>
        </div>
    )
}

