import React from "react";
import Galaxy from "./Galaxy";


export const WebCanvas = () => {
    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <Galaxy mouseRepulsion={false} density={0.5} saturation={0.7} />
        </div>
    );
};
