import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../Context/AuthManager";

const Register = () => {
  const { register:authRegister } = useAuth();

  const {
    register: reactRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Registering User:", data);
    console.log(data.password);
    authRegister(data);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
      {" "}
      <div className="bg-gray p-8 rounded-2xl shadow-lg w-full max-w-md">
        {" "}
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>{" "}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {" "}
          <input
            type="text"
            placeholder="Full Name"
            {...reactRegister("name", { required: "Name is required" })}
            className="w-full px-4 py-2 border rounded-md outline-none focus:outline-none text-ssblue"
          />{" "}
          {errors.name && (
            <p className="text-ssred text-sm">{errors.name.message}</p>
          )}{" "}
          <input
            type="email"
            placeholder="Email"
            {...reactRegister("email", { required: "Email is required" })}
            className="w-full px-4 py-2 border rounded-md outline-none focus:outline-none"
          />{" "}
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}{" "}
          <input
            type="password"
            placeholder="Password"
            {...reactRegister("password", { required: "Password is required" })}
            className="w-full px-4 py-2 border rounded-md outline-none focus:outline-none"
          />{" "}
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}{" "}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            {" "}
            Register{" "}
          </button>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
};

export default Register;
