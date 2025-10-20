import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import AuthProvider from "./Context/AuthManager";
import RoutesManager from "./Context/RoutesManager";
import Footer from "./components/Footer/footer";
import Galaxy from "./components/bg_animation/Galaxy";

const App = () => {
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [showLogo, setShowLogo] = useState(false);

    useEffect(() => {
        const videoDuration = 13000;
        const fadeDuration = 12000;

        const logoTimer = setTimeout(() => setShowLogo(true), 9005);
        const fadeTimer = setTimeout(() => setFadeOut(true), fadeDuration);
        const removeLoader = setTimeout(() => setLoading(false), videoDuration);

        return () => {
            clearTimeout(logoTimer);
            clearTimeout(fadeTimer);
            clearTimeout(removeLoader);
        };
    }, []);

    return (
        <>
            {loading ? (
                <div className={`loader ${fadeOut ? "fade-out" : ""}`}>
                    <video
                        src="/intro.mp4"
                        autoPlay
                        muted
                        playsInline
                        onEnded={() => {
                            setFadeOut(true);
                            setTimeout(() => setLoading(false), 500);
                        }}
                        style={{
                            width: "100vw",
                            height: "100vh",
                            objectFit: "cover",
                        }}
                    />
                    {showLogo && (
                        <div className="logo-overlay">
                            <img src="/logo-03.png" alt="TZ Logo 1" className="tz-logo small" />
                            <img src="/main_tz_logo.png" alt="TZ Logo 2" className="tz-logo large" />
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative w-full min-h-screen overflow-hidden">
                    <Galaxy mouseInteraction={false} />
                    <div className="relative z-10">
                        <AuthProvider>
                            <Navbar />
                            <RoutesManager />
                            {/* <Footer /> */}
                        </AuthProvider>
                    </div>
                </div>
            )}
        </>
    );
};

export default App;
