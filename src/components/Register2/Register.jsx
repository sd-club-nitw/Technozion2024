import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../Context/AuthManager";

const Register = () => {
  const { register: authRegister } = useAuth();

  const {
    register: reactRegister,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const watchedIdDocument = watch("idDocument");
  const watchedEvents = watch("events") || [];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedEventsState, setSelectedEventsState] = useState([]);

  useEffect(() => {
    if (watchedEvents && watchedEvents.length)
      setSelectedEventsState(
        Array.isArray(watchedEvents) ? watchedEvents : [watchedEvents]
      );
  }, [watchedEvents]);

  // ensure 'events' field is registered with react-hook-form so setValue works
  useEffect(() => {
    try {
      reactRegister && reactRegister("events");
    } catch (e) {
      // ignore
    }
  }, [reactRegister]);

  // sample events - replace with real events as needed
  const sampleEvents = [
    "Robo Race",
    "Coding Marathon",
    "Hackathon",
    "Paper Presentation",
    "Treasure Hunt",
  ];

  const handleFileLabelKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const el = document.getElementById("idDocument");
      if (el) el.click();
    }
  };

  const onSubmit = (data) => {
    if (data.idDocument && data.idDocument.length) {
      data.idDocument = data.idDocument[0];
    } else {
      data.idDocument = {};
    }

    console.log("Registering User:", data);
    authRegister(data);
  };

  return (
    <div className="flex justify-center items-center md:items-start min-h-screen p-4 md:pt-24 overflow-auto">
      <div
        className="bg-gray p-8 rounded-2xl shadow-lg w-full max-w-md"
        style={{ maxHeight: "calc(100vh - 4rem)", overflow: "auto" }}
      >
        {/* scoped override: hide the animated ::after glow for elements we mark with .no-glow */}
        <style>{`.no-glow::after { display: none !important; }`}</style>
        <h2 className="text-xl font-bold mb-2 text-center">
          Registration for technozion 2025
        </h2>
        <div className="mb-4 text-center">
          <div className="inline-block px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700">
            <div>
              Registration fee of TZ:{" "}
              <span className="font-semibold">₹500</span>
            </div>
            <div>
              Accommodation: <span className="font-semibold">₹100 / day</span>
            </div>
          </div>
        </div>

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
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Choose a strong password"
              {...reactRegister("password", {
                required: "Password is required",
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray focus:outline-none focus:ring-2 focus:ring-purple transition"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
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
              <p className="text-red-500 text-sm mt-1">
                {errors.collegeName.message}
              </p>
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

          <div className="flex flex-col relative">
            <label className="text-sm font-medium mb-1">
              Select events to register for
            </label>

            <div>
              <button
                type="button"
                onClick={() => setDropdownOpen((s) => !s)}
                className="w-full text-left px-4 py-2 rounded-lg bg-gray flex items-center justify-between focus:outline-none focus:ring-0"
              >
                <span className="text-sm text-gray-700">
                  {selectedEventsState && selectedEventsState.length > 0
                    ? selectedEventsState.join(", ")
                    : "Choose events..."}
                </span>
                <span className="text-xs text-gray-500">▾</span>
              </button>

              {dropdownOpen && (
                <div
                  className="mt-2 absolute z-20 w-full bg-gray border rounded-md p-3 no-glow"
                  style={{ maxHeight: "40vh", overflowY: "auto" }}
                >
                  {sampleEvents.map((ev) => {
                    const checked =
                      selectedEventsState && selectedEventsState.includes(ev);
                    return (
                      <label
                        key={ev}
                        className="flex items-center space-x-2 py-1"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            let next = [];
                            if (e.target.checked)
                              next = [...(selectedEventsState || []), ev];
                            else
                              next = (selectedEventsState || []).filter(
                                (x) => x !== ev
                              );
                            setSelectedEventsState(next);
                            setValue("events", next, { shouldValidate: true });
                          }}
                          className="h-4 w-4 text-lightGreen border-gray rounded"
                        />
                        <span className="text-sm">{ev}</span>
                      </label>
                    );
                  })}

                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(false)}
                      className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:scale-125 transition"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Upload Aadhar / College ID (optional)
            </label>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <input
                  id="idDocument"
                  type="file"
                  accept="image/*,.pdf"
                  {...reactRegister("idDocument", {
                    validate: (v) => {
                      if (!v || v.length === 0) return true;
                      const file = v[0];
                      if (file.size > 512000)
                        return "File must be 500 KB or smaller";
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
                  className="px-4 py-2 bg-gray text-white rounded-md cursor-pointer text-sm font-medium"
                  style={{ transition: "none", animation: "none" }}
                >
                  Choose file
                </label>

                <div className="text-sm text-gray-600">
                  {watchedIdDocument && watchedIdDocument.length ? (
                    <>
                      <span className="font-medium">
                        {watchedIdDocument[0].name}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({(watchedIdDocument[0].size / 1024).toFixed(1)} KB)
                      </span>
                    </>
                  ) : (
                    "No file chosen"
                  )}
                </div>
              </div>
            </div>
            {errors.idDocument && (
              <p className="text-red-500 text-sm mt-1">
                {errors.idDocument.message}
              </p>
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
