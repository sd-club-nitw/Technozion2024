import React, { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/webpack';
import gallery from "./Event_Schedule.pdf";
import { Loader } from '../Loader/index.js';
import { WebCanvas } from "../bg_animation/bg_animate"; // restore background
import './gallery.css';

const pdfjsVersion = "2.12.313";
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

export const Gallery = () => {
  const pdfRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadedPages, setLoadedPages] = useState(0);
  const [totalPages, setTotalPages] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);
        setLoadedPages(0);

        const pdf = await getDocument(gallery).promise;
        const pages = pdf.numPages;
        setTotalPages(pages);

        const pdfContainer = pdfRef.current;
        if (!pdfContainer) return;
        pdfContainer.innerHTML = ''; // Clear the container

        // default scale; you can tweak if pages blur or are too small
        const scale = window.innerWidth < 768 ? 0.9 : 1;

        for (let pageNum = 1; pageNum <= pages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;

          canvas.className = 'pdf-page-canvas';
          pdfContainer.appendChild(canvas);
          setLoadedPages(prev => prev + 1);
        }
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError('Failed to load PDF.');
      }
    };

    loadPDF();
  }, []);

  useEffect(() => {
    if (loadedPages > 0 && loadedPages === pdfRef.current?.childElementCount) {
      setLoading(false);
    }
  }, [loadedPages]);

  return (
    <div className="relative centered-container gallery-page">
      {/* animated background */}
      <div className="bg-wrapper">
        <WebCanvas className="bg-canvas" />
      </div>

      {/* main content (stacked above background) */}
      <div className="gallery-content">
        {/* controls column (left on desktop, top on mobile) */}
        <div className="gallery-controls">
          <a
            href="/pdf/Technozion-2025_Event_Schedule.pdf"
            download="Events_Schedule.pdf"
            className="download-btn"
            title="Download the Events schedule PDF"
            aria-label="Download gallery PDF"
          >
            ⤓ Download PDF
          </a>

        
        </div>

        {/* PDF viewer area */}
        <div className="pdf-column">
          {/* Canvas-rendered pages (hidden-scroll if many pages) */}
        

          {/* iframe fallback (always shown below canvases so it is available if needed).
              You can hide the iframe if you don't want it visible on desktop. */}
          <section className="pdf-iframe-section">
            <iframe
              src="/pdf/Technozion-2025_Event_Schedule.pdf#toolbar=0&zoom=page-width"
              title="Embedded PDF Document"
              className="pdf-iframe"
              style={{ border: "none" }}
            />
          </section>
        </div>
      </div>

      {/* optional loader overlay */}
      {loading && <div className="loader-overlay">{/* <Loader /> if you prefer */}</div>}
    </div>
  );
};
