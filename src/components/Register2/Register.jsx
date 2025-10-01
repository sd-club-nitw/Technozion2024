import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../Context/AuthManager";

const Register = () => {
  const { register: authRegister } = useAuth();

  const {
    register: reactRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const watchedIdDocument = watch("idDocument");

  const handleFileLabelKey = (e) => {
    // open file dialog when user presses Enter or Space on the label
    if (e.key === "Enter" || e.key === " ") {
      const el = document.getElementById("idDocument");
      if (el) el.click();
    }
  };

  const onSubmit = (data) => {
    // react-hook-form returns FileList for file inputs; convert to the first File object if present
    if (data.idDocument && data.idDocument.length) {
      data.idDocument = data.idDocument[0];
    } else {
      // explicitly send an empty object when no file was provided
      data.idDocument = {}
    }

    console.log("Registering User:", data);
    // password is available at data.password
    authRegister(data);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="bg-gray p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Registration for technozion 2025</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              {...reactRegister("name", { required: "Name is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray focus:outline-none focus:ring-2 focus:ring-purple transition"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...reactRegister("email", { required: "Email is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray focus:outline-none focus:ring-2 focus:ring-purple transition"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Choose a strong password"
              {...reactRegister("password", { required: "Password is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray focus:outline-none focus:ring-2 focus:ring-purple transition"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">College Name</label>
            <input
              type="text"
              placeholder="Your College"
              {...reactRegister("collegeName", {
                required: "College name is required",
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray focus:outline-none focus:ring-2 focus:ring-purple transition"
            />
            {errors.collegeName && (
              <p className="text-red-500 text-sm mt-1">{errors.collegeName.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <input
              id="accommodation"
              type="checkbox"
              {...reactRegister("accommodation")}
              className="h-4 w-4 text-purple focus:ring-purple border-gray-300 rounded"
            />
            <label htmlFor="accommodation" className="text-sm">
              I want accommodation
            </label>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Upload Aadhar / College ID (optional)</label>
            <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3">
                  {/* Hidden native input - trigger with the styled button below */}
                  <input
                    id="idDocument"
                    type="file"
                    accept="image/*,.pdf"
                    {...reactRegister("idDocument", {
                      validate: (v) => {
                        if (!v || v.length === 0) return true;
                        const file = v[0];
                        if (file.size > 512000) return "File must be 500 KB or smaller";
                        return true;
                      },
                    })}
                    className="sr-only"
                  />

                  <label
                    htmlFor="idDocument"
                    tabIndex={0}
                    onKeyDown={handleFileLabelKey}
                    role="button"
                    aria-label="Choose ID file"
                    className="px-4 py-2 bg-gray text-white rounded-md hover:bg-slate-700 cursor-pointer text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple active:scale-95"
                  >
                    Choose file
                  </label>

                  <div className="text-sm text-gray-600">
                    {watchedIdDocument && watchedIdDocument.length ? (
                      <>
                        <span className="font-medium">{watchedIdDocument[0].name}</span>
                        <span className="ml-2 text-xs text-gray-500">({(watchedIdDocument[0].size / 1024).toFixed(1)} KB)</span>
                      </>
                    ) : (
                      "No file chosen"
                    )}
                  </div>
                </div>
            </div>
            {errors.idDocument && (
              <p className="text-red-500 text-sm mt-1">{errors.idDocument.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gray text-white rounded-lg hover:bg-slate-800 transition font-semibold shadow-md"
            onSubmit={onSubmit}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
