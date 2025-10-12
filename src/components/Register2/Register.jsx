import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../Context/AuthManager";

const Register = () => {
  const { register: authRegister } = useAuth();
  const [societies, setSocieties] = useState([]);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const societiesRes = await fetch("/dataJSON/societyx.json");
        const clubsRes = await fetch("/dataJSON/club.json");

        const societiesData = await societiesRes.json();
        const clubsData = await clubsRes.json();

        setSocieties(societiesData);
        setClubs(clubsData);
      } catch (err) {
        console.error("Failed to fetch JSON:", err);
      }
    };

    fetchData();
  }, []);

  const finalData = React.useMemo(() => {
    const map = new Map();

    societies.forEach(soc => {
      map.set(soc.societyName, {
        societyName: soc.societyName,
        events: soc.events.map(ev => ({ ...ev, displayName: ev.title || ev.name }))
      });
    });

    clubs.forEach(club => {
      if (map.has(club.name)) {
        map.get(club.name).events.push({ ...club, displayName: club.title || club.name });
      } else {
        map.set(club.name, { societyName: club.name, events: [{ ...club, displayName: club.title || club.name }] });
      }
    });

    return Array.from(map.values());
  }, [societies, clubs]);

  const allEventsFromJSON = finalData.flatMap(item => item.events.map(ev => ev.displayName));

  const {
    register: reactRegister,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  // Keep form `events` and local selectedEventsState in sync
  const watchedEvents = watch("events") || [];
  useEffect(() => {
    if (watchedEvents && watchedEvents.length) {
      setSelectedEventsState(Array.isArray(watchedEvents) ? watchedEvents : [watchedEvents]);
    }
  }, [watchedEvents]);

  const watchedEmail = watch("email") || "";
  const watchedAccommodation = watch("accommodation") || false;
  const [selectedEventsState, setSelectedEventsState] = useState([]);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [idDocument, setIdDocument] = useState(null);

  useEffect(() => {
    try {
      reactRegister("events");
    } catch { }
  }, [reactRegister]);

  const isValidEmail = (email) => {
    if (!email || typeof email !== "string") return false;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email.trim().toLowerCase());
  };

  const computeAmount = () => {
    let amt = 0;
    if (watchedAccommodation) amt += 100;
    if (watchedEmail && !watchedEmail.includes("@nitw.ac.in")) amt += 500;
    return amt;
  };

  const normalizeFirstFile = (maybeFile) => {
    if (!maybeFile) return undefined;
    if (maybeFile instanceof File) return maybeFile;
    if (Array.isArray(maybeFile) && maybeFile[0]) return maybeFile[0];
    return undefined;
  };

  // Cloudinary helper (fill YOUR_CLOUD_NAME and ensure preset exists)
  const uploadToCloudinary = async (file) => {
    const cloudName = "dpjrslhwg"; // your Cloudinary cloud name
    const uploadPreset = "technozian_upload"; // the preset you just created

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url; // this is the uploaded file URL
  }; // Uses unsigned client-side upload with upload_preset as required by Cloudinary docs [web:4][web:2][web:3]

  const onSubmit = async (formData) => {
    try {
      // Validate events selection
      const eventsVal = Array.isArray(formData.events) ? formData.events : (formData.events ? [formData.events] : []);
      if (!eventsVal.length) {
        setError("events", { type: "required", message: "Select at least one event." });
        return;
      } else {
        clearErrors("events");
      }

      // College ID must be present
      const idFile = normalizeFirstFile(idDocument);
      if (!idFile) {
        setPaymentError("");
        setPayModalOpen(false);
        alert("Please upload a valid College ID document before registering.");
        return;
      }

      // Payment screenshot required if accommodation OR email not nitw.ac.in
      const needsPayment = Boolean(watchedAccommodation) || (isValidEmail(watchedEmail) && !watchedEmail.includes("@nitw.ac.in"));
      const payFile = normalizeFirstFile(paymentScreenshot);
      if (needsPayment && !payFile) {
        setPaymentError("Upload payment screenshot before registering.");
        setPayModalOpen(true);
        return;
      } else {
        setPaymentError("");
      }

      // Generate password
      const rand8 = Math.floor(10000000 + Math.random() * 90000000);
      const password = String(rand8);

      // Upload files to Cloudinary
      const idDocumentUrl = await uploadToCloudinary(idFile); // Returns secure_url which should be sent to backend [web:4]
      let paymentScreenshotUrl = null;
      if (needsPayment && payFile) {
        paymentScreenshotUrl = await uploadToCloudinary(payFile); // Same unsigned upload flow [web:4]
      }

      // Build backend payload
      const payload = {
        name: formData.name || "",
        email: (formData.email || "").trim(),
        password,
        collegeName: formData.collegeName || "",
        accommodation: !!formData.accommodation,
        events: eventsVal,
        idDocumentUrl: idDocumentUrl || null,
        paymentScreenshotUrl: paymentScreenshotUrl || null,
      };

      // Send to backend route (adjust URL if different)
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Registration failed with status ${res.status}`);
      }

      const result = await res.json();

      // Preserve original behavior: call authRegister with original data shape
      const authData = {
        ...formData,
        password,
        idDocument: idFile,
        paymentScreenshot: payFile || undefined,
      };

      console.log("Registering with data", authData);
      authRegister(authData);

      setPayModalOpen(false);
    } catch (err) {
      console.error("Register submit error:", err);
      alert(err.message || "Something went wrong during registration.");
    }
  };

  return (
    <div className="h-[100vh] bg-black text-white p-4 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto mt-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-cyan">
            Registration for Technozion 2025
          </h1>
          <h1 className="text-lg font-bold mb-4 text-cyan/80">
            Open to all years and branches from IITs, NITs, IIITs, and leading institutes.
          </h1>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
            <div className="px-4 py-2 bg-gray rounded-lg">
              Registration fee: <span className="font-semibold text-cyan">₹500</span>
            </div>
            <div className="px-4 py-2 bg-gray rounded-lg">
              Accommodation: <span className="font-semibold text-cyan">₹100/day</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-darkGray rounded-xl p-6 md:p-8 shadow-lg shadow-cyan/10">
              <h2 className="text-xl font-semibold mb-6 pb-3 border-b border-cyan/30">
                Personal Info
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    {...reactRegister("name", { required: "Name is required" })}
                    className="w-full px-4 py-3 bg-gray rounded-lg text-white placeholder-grayishWhite/50 focus:outline-none focus:ring-2 focus:ring-cyan transition"
                  />
                  {errors.name && <p className="text-cyan text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    placeholder="your.email@domain.com"
                    {...reactRegister("email", { required: "Email is required" })}
                    className="w-full px-4 py-3 bg-gray rounded-lg text-white placeholder-grayishWhite/50 focus:outline-none focus:ring-2 focus:ring-cyan transition"
                  />
                  {errors.email && <p className="text-cyan text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">College *</label>
                  <input
                    type="text"
                    placeholder="Enter college name"
                    {...reactRegister("collegeName", { required: "College name is required" })}
                    className="w-full px-4 py-3 bg-gray rounded-lg text-white placeholder-grayishWhite/50 focus:outline-none focus:ring-2 focus:ring-cyan transition"
                  />
                  {errors.collegeName && (
                    <p className="text-cyan text-sm mt-1">{errors.collegeName.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray rounded-lg">
                  <input
                    id="accommodation"
                    type="checkbox"
                    {...reactRegister("accommodation")}
                    className="h-5 w-5 accent-cyan"
                  />
                  <label htmlFor="accommodation" className="text-sm font-medium">
                    Need accommodation
                  </label>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Upload ID Document *</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setIdDocument(e.target.files[0])}
                    className="w-full text-sm text-white file:bg-cyan file:text-black file:px-4 file:py-2 rounded-lg hover:file:bg-cyanLight transition"
                  />
                </div>

                {((isValidEmail(watchedEmail) && !watchedEmail.includes("@nitw.ac.in")) || watchedAccommodation ) && (
                  <div className="pt-6">
                    <div className="bg-gray rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">Total</span>
                        <span className="text-xl font-bold text-cyan">₹{computeAmount()}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPayModalOpen(true)}
                        className="w-full px-4 py-3 bg-black/65 text-black rounded-lg hover:bg-black/30 hover:text-black transition font-medium"
                      >
                        Pay & Upload Screenshot
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-darkGray rounded-xl p-6 md:p-8 shadow-lg shadow-cyan/10">
              <h2 className="text-xl font-semibold mb-6 pb-3 border-b border-cyan/30">
                Event Selection
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Select Events *</label>
                  <div className="min-h-[120px] p-4 bg-gray rounded-lg mb-4">
                    {selectedEventsState.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedEventsState.map((event, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-3 py-1 bg-black/20 text-sm rounded-full"
                          >
                            {event}
                            <button
                              type="button"
                              onClick={() => {
                                const next = selectedEventsState.filter((e) => e !== event);
                                setSelectedEventsState(next);
                                setValue("events", next, { shouldValidate: true });
                              }}
                              className="ml-2 text-black hover:text-cyanDark"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray text-sm text-center">
                        No events selected yet
                      </div>
                    )}
                  </div>

                  <div className="space-y-6 max-h-[500px] overflow-y-auto">
                    {finalData.map((item) => (
                      <div key={item.societyName} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2 border-b border-cyan/30 pb-1">{item.societyName}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.events.map((ev, i) => {
                            const eventName = ev.displayName || "Unnamed Event";
                            const isSelected = selectedEventsState.includes(eventName);

                            return (
                              <label
                                key={i}
                                onClick={(e) => {
                                  e.preventDefault(); // prevent default focus
                                  const next = !isSelected
                                    ? [...selectedEventsState, eventName]
                                    : selectedEventsState.filter((x) => x !== eventName);
                                  setSelectedEventsState(next);
                                  setValue("events", next, { shouldValidate: true });
                                }}
                                className={`flex items-center p-2 rounded-lg cursor-pointer transition hover:bg-gray ${isSelected ? "bg-cyan/20" : "bg-black/10"}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  readOnly
                                  className="sr-only"
                                />
                                <span className="text-sm font-medium">{eventName}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    {errors.events && <p className="text-cyan text-sm mt-2">{errors.events.message}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              className="px-8 py-4 bg-blue-600 rounded-xl hover:bg-gray transition font-semibold text-lg shadow-lg hover:shadow-cyan/30 transform hover:-translate-y-0.5"
              onClick={handleSubmit(onSubmit)}
            >
              Complete Registration
            </button>
          </div>
        </form>
        <br />
        <br />
      </div>

      {payModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-darkGray rounded-2xl p-6 md:p-8 max-w-md w-full shadow-lg shadow-cyan/50 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 text-cyan text-center">
              Payment Details
            </h2>

            <div className="mb-6 text-white space-y-2 text-sm">
              <p className="font-medium">Bank Account Info:</p>
              <p>Account Name: <span className="font-semibold uppercase">Technozion</span></p>
              <p>Account No: <span className="font-semibold">62046706567</span></p>
              <p>IFSC: <span className="font-semibold">SBIN0020149</span></p>
              <p>Bank: <span className="font-semibold">SBI</span></p>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-white">Upload Payment Screenshot *</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setPaymentScreenshot(e.target.files[0])}
                className="w-full text-sm text-white file:bg-cyan file:text-black file:px-4 file:py-2 rounded-lg hover:file:bg-cyanLight transition"
              />
              {paymentError && <p className="text-cyan mt-2 text-sm">{paymentError}</p>}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setPayModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-gray/20 hover:bg-gray transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setPayModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-gray/10 text-black hover:bg-gray transition font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;