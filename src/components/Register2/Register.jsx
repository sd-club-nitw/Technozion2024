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

    // console.log("registering with data", data);

    // delegate to auth manager which should handle FormData when files are present
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
