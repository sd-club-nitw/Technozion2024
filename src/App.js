import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import AuthProvider from "./Context/AuthManager";
import RoutesManager from "./Context/RoutesManager";
import Footer from "./components/Footer/footer";
import Galaxy from "./components/bg_animation/Galaxy";
import FlyingLogo from "./components/IntroLoader/FlyingLogo";
import { WebCanvas } from "./components/bg_animation/bg_animate";
import { Loader } from "./components/Loader";

const App = () => {
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [showLogo, setShowLogo] = useState(false);

    useEffect(() => {
        
        setTimeout(() => setLoading(false), 5000);

      
    }, [showLogo, fadeOut]);

    return (
        <>
            {loading ? (
                <div className={`loader ${fadeOut ? 'fade-out' : ''}`}>
                    <Loader />
                </div>
            ) : (
                // <SnackbarProvider>
                    <AuthProvider>
                        <Navbar />
                        <RoutesManager />
                        {/* <Footer /> */}
                    </AuthProvider>
                // </SnackbarProvider>
            )}
        </>
    );
};

export default App;
