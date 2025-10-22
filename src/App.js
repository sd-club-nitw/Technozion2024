import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import AuthProvider from "./Context/AuthManager";
import RoutesManager from "./Context/RoutesManager";
import Footer from "./components/Footer/footer";
import Galaxy from "./components/bg_animation/Galaxy";
import FlyingLogo from "./components/IntroLoader/FlyingLogo";
import { WebCanvas } from "./components/bg_animation/bg_animate";

const App = () => {
    const [loading, setLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [showLogo, setShowLogo] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (video.currentTime >= 5.67 && !showLogo) {
                setShowLogo(true);
            }
            if (video.currentTime >= 7 && !fadeOut) {
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
                    <FlyingLogo />
                </div>
            ) : (
                <div className="relative w-full min-h-screen overflow-hidden">
                    {/* <Galaxy mouseInteraction={false} /> */}
                    {/* <WebCanvas /> */}
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
