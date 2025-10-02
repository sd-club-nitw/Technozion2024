import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../components/Loader'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const url = "http://localhost:5000"

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
    setLoading(true)
    try {
      let res;
      const normalizeFirstFile = (maybeFile) => {
        if (!maybeFile) return undefined
        if (typeof File !== 'undefined' && maybeFile instanceof File) return maybeFile
        if (maybeFile && maybeFile.length && maybeFile[0]) return maybeFile[0]
        if (Array.isArray(maybeFile) && maybeFile.length) return maybeFile[0]
        return undefined
      }

      const idFile = normalizeFirstFile(registrationData && registrationData.idDocument)
      const paymentFile = normalizeFirstFile(registrationData && registrationData.paymentScreenshot)
      const hasFiles = !!(idFile || paymentFile)

      if (hasFiles) {
        // Temporarily do NOT send actual files. Send JSON metadata only so backend
        // continues to receive req.body (express.json()). Files will be uploaded to
        // Cloudinary later and you can update backend accordingly.
        const payload = {
          name: registrationData.name || '',
          email: registrationData.email || '',
          password: registrationData.password || '',
          collegeName: registrationData.collegeName || '',
          accommodation: registrationData.accommodation,
          events: registrationData.events,
          idDocumentName: idFile ? idFile.name : undefined,
          paymentScreenshotName: paymentFile ? paymentFile.name : undefined,
        }

        res = await fetch(`${url}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        const payload = {
          name: registrationData?.name,
          email: registrationData?.email,
          password: registrationData?.password,
          collegeName: registrationData?.collegeName,
          accommodation: registrationData?.accommodation,
          events: registrationData?.events,
        }
        if (registrationData && registrationData.idDocument && !(registrationData.idDocument instanceof File)) payload.idDocument = registrationData.idDocument

        res = await fetch(`${url}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('user_info', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        setUser(data.user)
        navigate('/')
      } else {
        console.log('register error', data)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
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
