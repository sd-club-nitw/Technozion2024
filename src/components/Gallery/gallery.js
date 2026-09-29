import React, { useEffect, useRef, useState } from 'react';
import { WebCanvas } from "../bg_animation/bg_animate";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/webpack';
import gallery from "./gallery.pdf";
import { Loader } from '../Loader/index.js'; 
import './gallery.css';

const pdfjsVersion = "2.12.313"; 
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

export const Gallery = () => {
    const pdfRef = useRef(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [loadedPages, setLoadedPages] = useState(0); // Track number of loaded pages

    useEffect(() => {
        const loadPDF = async () => {
            try {
                const pdf = await getDocument(gallery).promise;
                const totalPages = pdf.numPages;
                const pdfContainer = pdfRef.current;
                pdfContainer.innerHTML = ''; // Clear the container

                const scale = window.innerWidth < 768 ? 0.6 : 1; // Adjust scale based on screen width

                for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const viewport = page.getViewport({ scale });

                    // Create and configure canvas
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    // Render PDF page into canvas
                    await page.render({
                        canvasContext: context,
                        viewport,
                    }).promise;

                    // Append the canvas to the container in order
                    pdfContainer.appendChild(canvas);

                    // Track page loading progress
                    setLoadedPages((prev) => prev + 1);
                }
            } catch (error) {
                console.error("Error loading PDF:", error);
            }
        };

        loadPDF();
    }, []);

    useEffect(() => {
        if (loadedPages > 0 && loadedPages === pdfRef.current?.childElementCount) {
            setLoading(false); // Hide loader once all pages are loaded
        }
    }, [loadedPages]);

    return (
        <div className="centered-container">
            <div className="gallery-canvas">
                <WebCanvas />
            </div>
            {loading && <Loader />} {/* Show loader until all PDF pages are loaded */}
            <div 
                className={`pdf-container ${loading ? 'hidden' : ''}`} 
                ref={pdfRef}
            >
                {/* Canvas elements will be appended here */}
            </div>
        </div>
    );
};
