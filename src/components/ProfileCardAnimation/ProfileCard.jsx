import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import './ProfileCard.css'; // this file includes component + styles in the canvas

/*
  PosterCard (updated)
  - Keeps the animated colourful background + tilt behaviour
  - Photo area is kept clean (no shine/glare overlays)
  - Cards are fully rectangular (no curves)
  - Provides an easy `.poster` wrapper style that matches your cyan border + glow
  - Ensures all cards use the same fixed size so images don't 'merge' or resize differently

  Usage (same as before):
    <PosterCard
      className="poster"                 // adds the cyan border/glow and consistent sizing
      imageSrc={event.imgsrc}
      fallbackSrc={imgsrc}
      title={event.title}
      subtitle={event.name}
      onContactClick={() => handlePosterClick(event)}
    />

  If you need a different fixed size, edit the CSS variables: --card-w and --card-h inside the .poster rule.
*/

const DEFAULT_BEHIND_GRADIENT = 'radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00c1ffff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)';
const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

const clamp = (v, a=0,b=100) => Math.min(Math.max(v,a),b);
const round = (v,p=3)=>parseFloat(v.toFixed(p));
const adjust = (v,fa,fb,ta,tb)=> round(ta + ((tb-ta)*(v-fa))/(fb-fa));
const easeInOutCubic = x => (x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2);

const PosterCard = ({
  imageSrc = '',
  fallbackSrc = '',
  title = '',
  subtitle = '',
  grainUrl = '',
  onContactClick,
  className = '',
  enableTilt = true
}) => {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);

  const isTouchDevice =
    typeof window !== "undefined" && "ontouchstart" in window;


  const handlers = useMemo(() => {
    if (!enableTilt || isTouchDevice) return null;
    let rafId = null;
    const update = (offsetX, offsetY, card, wrap) => {
      const w = card.clientWidth, h = card.clientHeight;
      const px = clamp((100 / w) * offsetX);
      const py = clamp((100 / h) * offsetY);
      const cx = px - 50, cy = py - 50;
      const props = {
        '--pointer-x': `${px}%`,
        '--pointer-y': `${py}%`,
        '--background-x': `${adjust(px,0,100,35,65)}%`,
        '--background-y': `${adjust(py,0,100,35,65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(py-50, px-50)/50,0,1)}`,
        '--pointer-from-top': `${py/100}`,
        '--pointer-from-left': `${px/100}`,
        '--rotate-x': `${round(-(cx/6))}deg`,
        '--rotate-y': `${round(cy/6)}deg`
      };
      Object.entries(props).forEach(([k,v])=> wrap.style.setProperty(k,v));
    };

    const smooth = (duration, sx, sy, card, wrap) => {
      const start = performance.now();
      const tx = wrap.clientWidth/2, ty = wrap.clientHeight/2;
      const loop = t => {
        const elapsed = t - start;
        const p = Math.min(elapsed/duration,1);
        const e = easeInOutCubic(p);
        const curX = adjust(e,0,1,sx,tx);
        const curY = adjust(e,0,1,sy,ty);
        update(curX, curY, card, wrap);
        if (p < 1) rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    };

    return {
      update, smooth,
      cancel: () => { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
    };
  }, [enableTilt,isTouchDevice]);

  const onMove = useCallback(e => {
    const card = cardRef.current, wrap = wrapRef.current;
    if (!card || !wrap || !handlers) return;
    const rect = card.getBoundingClientRect();
    handlers.update(e.clientX - rect.left, e.clientY - rect.top, card, wrap);
  }, [handlers]);

  const onEnter = useCallback(() => {
    const card = cardRef.current, wrap = wrapRef.current;
    if (!card || !wrap || !handlers) return;
    handlers.cancel();
    wrap.classList.add('active');
    card.classList.add('active');
  }, [handlers]);

  const onLeave = useCallback((e) => {
    const card = cardRef.current, wrap = wrapRef.current;
    if (!card || !wrap || !handlers) return;
    handlers.smooth(500, e.offsetX || wrap.clientWidth/2, e.offsetY || wrap.clientHeight/2, card, wrap);
    wrap.classList.remove('active');
    card.classList.remove('active');
  }, [handlers]);

  useEffect(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap) return;

    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (handlers && !isTouch) {
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);

      // initial subtle animation
      const ix = wrap.clientWidth - 40;
      const iy = 40;
      handlers.update(ix, iy, card, wrap);
      handlers.smooth(1000, ix, iy, card, wrap);
    }

    // 👇 This line is key — it tells browser to keep scroll gestures
    card.style.touchAction = "auto";

    return () => {
      if (handlers && !isTouch) {
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
        handlers.cancel();
      }
    };
  }, [handlers, onEnter, onLeave, onMove]);


  const style = useMemo(() => ({
    '--grain': grainUrl ? `url(${grainUrl})` : 'none',
    '--behind-gradient': DEFAULT_BEHIND_GRADIENT,
    '--inner-gradient': DEFAULT_INNER_GRADIENT
  }), [grainUrl]);

  const handleClick = useCallback((e) => onContactClick?.(e), [onContactClick]);
  const onKeyDown = useCallback(e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onContactClick?.(e); }
  }, [onContactClick]);

  return (
    <div ref={wrapRef} className={`pc-card-wrapper poster-card ${className}`.trim()} style={style}>
      <section
        ref={cardRef}
        className="pc-card poster-card-section"
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={onKeyDown}
        aria-label={title || subtitle || 'poster card'}
      >
        <div className="pc-inside poster-inside">
          {/* image area - CLEAN: no overlays on the photo */}
          <div className="pc-avatar-content poster-image-wrap">
            <img
              className="avatar poster-avatar"
              src={imageSrc || fallbackSrc}
              alt={title || subtitle || 'poster'}
              loading="lazy"
              onError={e => {
                const t = e.target;
                if (fallbackSrc && t.src !== fallbackSrc) t.src = fallbackSrc;
                else t.style.display = 'none';
              }}
            />
            <div className="pc-shine poster-shine" aria-hidden="true" />
            <div className="pc-glare poster-glare" aria-hidden="true" />
          </div>

          {/* footer with title / subtitle */}
          <div className="poster-footer">
            {title && <h4 className="poster-title">{title}</h4>}
            {subtitle && <div className="poster-sub">{subtitle}</div>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(PosterCard);

