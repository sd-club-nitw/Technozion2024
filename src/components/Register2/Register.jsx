import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useForm } from "react-hook-form";
import { useAuth } from "../../Context/AuthManager";


const Register = () => {
  const { register: authRegister } = useAuth();

  const {
    register : reactRegister,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const watchedIdDocument = watch("idDocument");
  const watchedEvents = watch("events") || [];
  const watchedEmail = watch("email") || "";
  const watchedAccommodation = watch("accommodation") || false;

  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
  const [selectedEventsState, setSelectedEventsState] = useState([]);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [showGeneratedQR, setShowGeneratedQR] = useState(false);

  useEffect(() => {
    if (watchedEvents && watchedEvents.length)
      setSelectedEventsState(
        Array.isArray(watchedEvents) ? watchedEvents : [watchedEvents]
      );
  }, [watchedEvents]);

  useEffect(() => {
    try {
      reactRegister("events");
    } catch (e) {
      // It might throw an error on re-render if already registered, safe to ignore.
    }
  }, [reactRegister]);

  const allEvents = [
    "Robo Race",
    "Coding Marathon",
    "Hackathon",
    "Paper Presentation",
    "Treasure Hunt",
    "Web Weaver",
    "Circuitrix",
    "Drone Challenge",
    "AI Symposium",
    "Game Dev Expo",
    "Startup Pitch",
    "Tech Quiz",
    "Ethical Hacking Workshop",
    "CAD Contest",
    "IoT Innovation Challenge",
  ];

  const handleFileLabelKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const el = document.getElementById("idDocument");
      if (el) el.click();
    }
  };

  const isValidEmail = (email) => {
    if (!email || typeof email !== "string") return false;
    const trimmed = email.trim().toLowerCase();
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(trimmed);
  };

  const computeAmount = () => {
    let amount = 0;
    if (watchedAccommodation) amount += 100;
    if (watchedEmail && !watchedEmail.includes("@nitw.ac.in")) {
        amount += 500;
    }
    return amount;
  };

  const normalizeFirstFile = (maybeFile) => {
    if (!maybeFile) return undefined;
    if (typeof File !== "undefined" && maybeFile instanceof File)
      return maybeFile;
    if (maybeFile && maybeFile.length && maybeFile[0]) return maybeFile[0];
    if (Array.isArray(maybeFile) && maybeFile.length) return maybeFile[0];
    return undefined;
  };

  const onSubmit = (data) => {
    if (!data) return;

    const eventsVal = data.events || [];
    if (!eventsVal || (Array.isArray(eventsVal) && eventsVal.length === 0)) {
      setError("events", {
        type: "required",
        message: "Please select at least one event.",
      });
      return;
    } else {
      clearErrors("events");
    }

    const idFile = normalizeFirstFile(data.idDocument);

    if (watchedEmail && !watchedEmail.includes("@nitw.ac.in")) {
      if (!paymentScreenshot) {
        setPaymentError(
          "Please upload a payment screenshot before registering."
        );
        setPayModalOpen(true);
        return;
      } else {
        setPaymentError("");
      }
    }

    try {
      const rand8 = Math.floor(10000000 + Math.random() * 90000000);
      data.password = String(rand8);
    } catch (e) {
      data.password = "00000000";
    }

    if(idFile) data.idDocument = idFile;
    if (paymentScreenshot) data.paymentScreenshot = paymentScreenshot;

    console.log("Registering with data", data);
    authRegister(data);
  };

  const EventsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-fade-in">
      <div className="bg-gray-800 text-white rounded-2xl shadow-xl w-full max-w-2xl h-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold">Select Events</h3>
          <p className="text-sm text-gray-400">Choose all the events you want to participate in.</p>
        </div>
        <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allEvents.map((ev) => {
              const checked = selectedEventsState && selectedEventsState.includes(ev);
              return (
                <label key={ev} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      let next = [];
                      if (e.target.checked)
                        next = [...selectedEventsState, ev];
                      else
                        next = selectedEventsState.filter((x) => x !== ev);
                      setSelectedEventsState(next);
                      setValue("events", next, { shouldValidate: true });
                    }}
                    className="h-5 w-5 text-purple-600 bg-gray-900 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="font-medium">{ev}</span>
                </label>
              );
            })}
          </div>
        </div>
        <div className="p-6 border-t border-gray-700 text-right">
          <button
            type="button"
            onClick={() => setIsEventsModalOpen(false)}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );


  return (
<<<<<<< HEAD
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
            className="w-full px-4 py-2 border rounded-md outline-none focus:outline-none bg-gray"
          />{" "}
          {errors.name && (
            <p className="text-ssred text-sm">{errors.name.message}</p>
          )}{" "}
          <input
            type="email"
            placeholder="Email"
            {...reactRegister("email", { required: "Email is required" })}
            className="w-full px-4 py-2 border rounded-md outline-none focus:outline-none bg-gray"
          />{" "}
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}{" "}
          <input
            type="password"
            placeholder="Password"
            {...reactRegister("password", { required: "Password is required" })}
            className="w-full px-4 py-2 border rounded-md outline-none focus:outline-none bg-gray"
          />{" "}
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}{" "}
=======
    <div className="flex justify-center items-center md:items-start min-h-screen p-2 sm:p-4 md:pt-24 overflow-auto bg-gray text-gray-300">

      {isEventsModalOpen && <EventsModal />}

      <div
        className="bg-gray p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-md custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 4rem)", overflow: "auto" }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-white">
          Registration for Technozion 2025
        </h2>
        <div className="mb-6 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <div className="px-3 py-2 bg-gray-700 rounded-md text-sm w-full sm:w-auto">
              Registration fee:{" "}
              <span className="font-semibold text-white">₹500</span>
            </div>
            <div className="px-3 py-2 bg-gray-700 rounded-md text-sm w-full sm:w-auto">
              Accommodation: <span className="font-semibold text-white">₹100 / day</span>
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
              className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...reactRegister("email", { required: "Email is required" })}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
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
              className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            {errors.collegeName && (
              <p className="text-red-400 text-sm mt-1">
                {errors.collegeName.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <input
              id="accommodation"
              type="checkbox"
              {...reactRegister("accommodation")}
              className="h-4 w-4 text-purple-600 bg-gray-700 focus:ring-purple-500 border-gray-600 rounded"
            />
            <label htmlFor="accommodation" className="text-sm">
              I want accommodation
            </label>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-2">
              Registered Events
            </label>
            <div className="p-3 min-h-[48px]  border-dashed border-gray-600 rounded-lg bg-gray-700">
              <span className="text-sm text-gray-400 italic overflow-auto">
                {selectedEventsState.length > 0 ? selectedEventsState.join(', ') : "No events selected yet."}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsEventsModalOpen(true)}
              className="mt-2 w-full text-center px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold transition"
            >
              Select Events
            </button>
            {errors.events && <p className="text-red-400 text-sm mt-1">{errors.events.message}</p>}
          </div>


          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Upload Aadhar / College ID (optional)
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 mt-1">
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
                className="px-4 py-2 bg-gray-600 text-white rounded-md cursor-pointer text-sm font-medium text-center hover:bg-gray-500"
              >
                Choose file
              </label>

              <div className="text-sm text-gray-400 truncate">
                {watchedIdDocument && watchedIdDocument.length ? (
                  <>
                    <span className="font-medium text-gray-200">
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
            {errors.idDocument && (
              <p className="text-red-400 text-sm mt-1">
                {errors.idDocument.message}
              </p>
            )}
          </div>

          {isValidEmail(watchedEmail) && !watchedEmail.includes("@nitw.ac.in") && (
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm">Amount payable</div>
                <div className="text-lg font-semibold text-white">₹{computeAmount()}</div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setPayModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Pay & Upload Screenshot
                </button>
              </div>

              {payModalOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-90 p-4 animate-fade-in">
                  <div className="bg-gray rounded-lg max-w-lg w-full p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg text-white">Scan QR to pay</h3>
                      <button
                        onClick={() => setPayModalOpen(false)}
                        className="text-gray-400 hover:text-white text-2xl leading-none"
                      >
                        &times;
                      </button>
                    </div>

                    <div className="flex flex-col items-center">
                       <div className="p-2 bg-white rounded-md border">
                        <QRCode value={`upi://pay?pa=technozion@nitw&pn=Technozion NITW&am=${computeAmount()}`} size={200} />
                      </div>
                      <div className="text-sm text-gray-400 my-4">
                        Upload a screenshot of the payment below.
                      </div>
                      <input
                        id="paymentScreenshot"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files && e.target.files[0];
                          if (f) {
                            const max = 512000; // 500 KB
                            if (f.size > max) {
                              setPaymentScreenshot(null);
                              setPaymentError(
                                "Payment screenshot must be 500 KB or smaller."
                              );
                              return;
                            }
                            setPaymentScreenshot(f);
                            setPaymentError("");
                          }
                        }}
                        className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                      />
                      {paymentError && <p className="text-red-400 text-sm mt-2">{paymentError}</p>}
                      {paymentScreenshot && (
                        <div className="text-sm mt-2 text-center">
                          <div className="font-medium">
                            {paymentScreenshot.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {(paymentScreenshot.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end w-full mt-6">
                        <button
                          onClick={() => setPayModalOpen(false)}
                          className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {paymentError && (
            <div className="text-red-400 text-sm mt-2">{paymentError}</div>
          )}

>>>>>>> c569a10bf3cf4169c980c6b9f3a4f58845d462b7
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold shadow-md"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

