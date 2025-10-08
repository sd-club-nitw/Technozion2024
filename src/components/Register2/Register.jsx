import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useForm } from "react-hook-form";
import { useAuth } from "../../Context/AuthManager";

const Register = () => {
  const { register: authRegister } = useAuth();

  const {
    register: reactRegister,
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
      reactRegister && reactRegister("events");
    } catch (e) {}
  }, [reactRegister]);

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

  const isValidGmail = (email) => {
    if (!email || typeof email !== "string") return false;
    const trimmed = email.trim().toLowerCase();
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(trimmed);
  };

  const computeAmount = () => {
    let amount = 0;
    if (watchedAccommodation) amount += 100;
    if (!watchedEmail || typeof watchedEmail !== "string") return amount;
    if (!watchedEmail.includes("niw.ac.in")) amount += 500;
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

  const hasFile = (maybeFile) => !!normalizeFirstFile(maybeFile);

  const onSubmit = (data) => {
    if (!data) return;

    if (!data.name) {
      setError("name", { type: "required", message: "Name is required" });
      return;
    } else {
      clearErrors("name");
    }
    if (!data.email) {
      setError("email", { type: "required", message: "Email is required" });
      return;
    } else {
      clearErrors("email");
    }
    if (!data.collegeName) {
      setError("collegeName", {
        type: "required",
        message: "College name is required",
      });
      return;
    } else {
      clearErrors("collegeName");
    }

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
    if (!idFile) {
      setError("idDocument", {
        type: "required",
        message: "Please upload your College ID/Aadhar.",
      });
      const el = document.getElementById("idDocument");
      if (el) el.focus();
      return;
    } else {
      clearErrors("idDocument");
    }

    if (watchedEmail && !watchedEmail.includes("niw.ac.in")) {
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

    // replace idDocument field with the normalized File
    data.idDocument = idFile;
    if (paymentScreenshot) data.paymentScreenshot = paymentScreenshot;

    console.log("registering with data", data);

    // delegate to auth manager which should handle FormData when files are present
    authRegister(data);
  };

  return (
    <div className="flex justify-center items-center md:items-start min-h-screen p-2 sm:p-4 md:pt-24 overflow-auto">
      <div
        className="bg-gray p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-md"
        style={{ maxHeight: "calc(100vh - 4rem)", overflow: "auto" }}
      >
        <style>{`.no-glow::after { display: none !important; }`}</style>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          Registration for technozion 2025
        </h2>
        <div className="mb-6 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <div className="px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700 w-full sm:w-auto">
              Registration fee of TZ:{" "}
              <span className="font-semibold">₹500</span>
            </div>
            <div className="px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700 w-full sm:w-auto">
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
              {errors.events && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.events.message}
                </p>
              )}
            </div>
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
                className="px-4 py-2 bg-gray text-white rounded-md cursor-pointer text-sm font-medium text-center"
                style={{ transition: "none", animation: "none" }}
              >
                Choose file
              </label>

              <div className="text-sm text-gray-600 truncate">
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
            {errors.idDocument && (
              <p className="text-red-500 text-sm mt-1">
                {errors.idDocument.message}
              </p>
            )}
          </div>

          {isValidGmail(watchedEmail) && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-700">Amount payable</div>
                <div className="text-lg font-semibold">₹{computeAmount()}</div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setPayModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Pay here
                </button>

                <div className="text-sm text-gray-500">
                  (or upload payment screenshot in the modal)
                </div>
              </div>

              {payModalOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60 p-4">
                  <div className="bg-[#242424] rounded-lg max-w-lg w-full p-4 ">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold">Scan QR to pay</h3>
                      <button
                        onClick={() => setPayModalOpen(false)}
                        className="text-sm text-gray-600"
                      >
                        Close
                      </button>
                    </div>

                    <div className="flex flex-col items-center">
                      <img
                        src="/qr.png"
                        alt="payment qr"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          setShowGeneratedQR(true);
                        }}
                        onLoad={() => setShowGeneratedQR(false)}
                        className="w-56 h-56 object-contain mb-3 bg-gray-100 p-2"
                      />

                      <div className="text-sm text-gray-600 mb-3">
                        Upload a screenshot of the payment below
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
                        className="m-2 bg-gray text-center rounded-md"
                      />

                      {paymentScreenshot && (
                        <div className="text-sm text-gray-700 mt-2">
                          <div className="font-medium">
                            {paymentScreenshot.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {(paymentScreenshot.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end w-full mt-4">
                        <button
                          onClick={() => setPayModalOpen(false)}
                          className="px-3 py-1 bg-gray-200 rounded-md mr-2"
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
            <div className="text-red-500 text-sm mt-2">{paymentError}</div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gray text-white rounded-lg hover:bg-slate-800 transition font-semibold shadow-md"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
