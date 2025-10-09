import React from "react";
import { useForm } from "react-hook-form";

const Payment = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log("Payment Details:", data);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-gray p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Payment Details</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div>
                        <label className="block mb-2 font-medium">Accommodation</label>
                        <select
                            {...register("accommodation", { required: "Please select an option" })}
                            className="w-full px-4 py-2 border rounded-md outline-none focus:outline-none bg-gray"
                        >
                            <option value="">Select</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                        {errors.accommodation && <p className="text-red-500 text-sm">{errors.accommodation.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Fee</label>
                        <input
                            type="text"
                            value="₹500"
                            readOnly
                            className="w-full px-4 py-2 border rounded-md bg-gray cursor-not-allowed"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                        Pay & Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Payment;
