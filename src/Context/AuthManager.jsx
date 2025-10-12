import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../components/Loader'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const url = window.localtion.origin // TODO: change this to env variable

  useEffect(() => {
    const storedUser = localStorage.getItem('user_info')
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await fetch(`${url}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('user_info', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        setUser(data.user)
        navigate('/')
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.log(err)
      alert("Something went wrong")
    }
    finally { setLoading(false) }
  }

  // register accepts a single object with fields used by the frontend form.
  // It supports File, FileList or array for idDocument and paymentScreenshot.
  const register = async (registrationData) => {
  setLoading(true);
  try {
    // Helper: upload a file to Cloudinary and return the URL
    const uploadToCloudinary = async (file) => {
      const cloudName = "dpjrslhwg"; // replace with your Cloudinary cloud name
      const uploadPreset = "technozian_upload"; // replace with your preset
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.secure_url; // return the uploaded file URL
    };

    // Upload ID Document
    let idDocumentUrl = null;
    if (registrationData.idDocument) {
      const idFile = Array.isArray(registrationData.idDocument)
        ? registrationData.idDocument[0]
        : registrationData.idDocument;
      idDocumentUrl = await uploadToCloudinary(idFile);
    } else {
      alert("Please upload your College ID/Aadhar.");
      setLoading(false);
      return;
    }

    // Upload Payment Screenshot if needed
    let paymentScreenshotUrl = null;
    const emailDomain = registrationData.email?.trim().toLowerCase().split("@")[1];
    if (emailDomain !== "nitw.ac.in") {
      if (registrationData.paymentScreenshot) {
        const paymentFile = Array.isArray(registrationData.paymentScreenshot)
          ? registrationData.paymentScreenshot[0]
          : registrationData.paymentScreenshot;
        paymentScreenshotUrl = await uploadToCloudinary(paymentFile);
      } else {
        alert("Please upload a payment screenshot for non-niw.ac.in emails.");
        setLoading(false);
        return;
      }
    }

    // Prepare payload for backend
    const payload = {
      name: registrationData.name || "",
      email: registrationData.email || "",
      password: registrationData.password || "",
      collegeName: registrationData.collegeName || "",
      accommodation: registrationData.accommodation || false,
      events: registrationData.events || [],
      idDocumentUrl,
      paymentScreenshotUrl,
    };

    // Send JSON with URLs to backend
    const res = await fetch(`${url}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("user_info", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setUser(data.user);
      alert("Registration successful! Your ID is "+data?.user?.registrationNum);
      navigate("/");
    } else {
      console.log("register error", data);
      alert(data.message || "Registration failed");
    }
  } catch (err) {
    console.log(err);
    alert("Something went wrong during registration.");
  } finally {
    setLoading(false);
  }
};


  const logout = () => {
    const ok = window.confirm("Logout?");
    if(!ok) return;
    localStorage.removeItem('user_info')
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setLoading }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  )
}

export default AuthProvider