import React, { useEffect, useRef, useState } from "react";
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
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (video.currentTime >= 9.005 && !showLogo) {
                setShowLogo(true);
            }
            if (video.currentTime >= 12 && !fadeOut) {
                setFadeOut(true);
            }
        };

        const handleEnded = () => {
            setFadeOut(true);
            setTimeout(() => setLoading(false), 500);
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("ended", handleEnded);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("ended", handleEnded);
        };
    }, [showLogo, fadeOut]);

    return (
        <>
            {loading ? (
                <div className={`loader ${fadeOut ? "fade-out" : ""}`}>
                    <video
                        ref={videoRef}
                        src="/intro.mp4"
                        autoPlay
                        muted
                        playsInline
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
