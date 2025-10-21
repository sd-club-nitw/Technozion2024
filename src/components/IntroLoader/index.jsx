import { useEffect, useState } from "react";
import FlyingLogo from "./FlyingLogo";

export default function IntroLoader({ onFinish }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const played = sessionStorage.getItem("introPlayed");
        if (played) {
            onFinish();
            return;
        }

        const timer = setTimeout(() => {
            setShow(false);
            sessionStorage.setItem("introPlayed", "true");
            onFinish();
        }, 5000); // fallback if video doesn't end

        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!show) return null;

    return (
        <div className="intro-loader">
            <video
                src="/intro.mp4"
                autoPlay
                muted
                playsInline
                onEnded={() => {
                    setShow(false);
                    sessionStorage.setItem("introPlayed", "true");
                    onFinish();
                }}
                style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
            />
            <FlyingLogo />
        </div>
    );
}
