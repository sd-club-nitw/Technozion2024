import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../components/Loader'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const url = process.env.REACT_APP_BACKEND_URL

  useEffect(() => {
    const storedUser = localStorage.getItem('user_info')
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('user_info', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        setUser(data.user)
        if (data.user.needsPayment) navigate('/payment')
        else navigate('/')
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.log(err)
      alert("Something went wrong")
    }
    finally { setLoading(false) }
  }

  // register accepts a single object with fields:
  // { name, email, password, collegeName, accommodation, idDocument }
  const register = async (registrationData) => {
    setLoading(true)
    try {
      let res

      // If idDocument is a File, send multipart/form-data
      if (registrationData && registrationData.idDocument && registrationData.idDocument instanceof File) {
        const form = new FormData()
        form.append('name', registrationData.name || '')
        form.append('email', registrationData.email || '')
        form.append('password', registrationData.password || '')
        if (registrationData.collegeName) form.append('collegeName', registrationData.collegeName)
        if (typeof registrationData.accommodation !== 'undefined') form.append('accommodation', String(registrationData.accommodation))
        form.append('idDocument', registrationData.idDocument)

        res = await fetch(`${url}/auth/register`, {
          method: 'POST',
          body: form
        })
      } else {
        // Fallback: send JSON (no file)
        const payload = {
          name: registrationData?.name,
          email: registrationData?.email,
          password: registrationData?.password,
          collegeName: registrationData?.collegeName,
          accommodation: registrationData?.accommodation,
          // include idDocument object if provided (not a File)
          ...(registrationData && registrationData.idDocument && !(registrationData.idDocument instanceof File) ? { idDocument: registrationData.idDocument } : {})
        }

        res = await fetch(`${url}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('user_info', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        setUser(data.user)
        if (data.user.needsPayment) navigate('/payment')
        else navigate('/')
      } else {
        console.log(data)
        console.log(data.message)
      }
    } catch (err) {
      console.log(err)
      alert("Something went wrong")
    }
    setLoading(false)
  }

  const logout = () => {
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
