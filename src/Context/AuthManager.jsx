import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../components/Loader'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const url = window.location.origin

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

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const res = await fetch(`${url}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('user_info', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        setUser(data.user)
        if (data.user.needsPayment) navigate('/payment')
        else navigate('/')
      } 
      else{
        alert(data.message);
      }
    } catch (err) {
      alert(err);
    }

    // Upload Payment Screenshot if needed
    let paymentScreenshotUrl = null;
    const emailDomain = registrationData.email?.trim().toLowerCase().split("@")[1];
    if (emailDomain !== "niw.ac.in") {
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
      alert(`Successfully Registered you id is ${data?.user?.registrationNum || 'NA'}` )
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
