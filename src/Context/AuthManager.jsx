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
      } else {
        alert(data.message)
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
