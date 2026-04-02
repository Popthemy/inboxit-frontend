import React, { useRef, useState, useEffect } from "react";

const isSafari = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf("safari") > -1 && ua.indexOf("chrome") < 0;
};

const mainVideo = "../images/inboxjet-liveshow.mp4";

export function MutedVideo() {
  const videoParentRef = useRef();
  const [shouldUseImage, setShouldUseImage] = useState(false);

  useEffect(() => {
    if (isSafari() && videoParentRef.current) {
      const player = videoParentRef.current.children[0];

      if (player) {
        player.controls = false;
        player.playsinline = true;
        player.muted = true;
        player.setAttribute("muted", "");
        player.autoplay = true;

        setTimeout(() => {
          const promise = player.play();
          if (promise.then) {
            promise
              .then(() => {})
              .catch(() => {
                videoParentRef.current.style.disply = "none";
                setShouldUseImage(true);
              });
          }
        }, 0);
      }
    }
  }, []);
  return shouldUseImage ? (
    <img
      className="w-full h-full object-cover"
      src={mainVideo}
      alt="inboxjet welcome video"
    />
  ) : (
    <div
      ref={videoParentRef}
      className="relative w-full h-full overflow-hidden"
      dangerouslySetInnerHTML={{
        __html: `<video 
      loop
      muted
      autoplay
      playsinline
      preload="metadata">
      style="
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: auto;
          min-height: 100%;
          transform: translate(-50%, -50%);
        "transform: translate(-50%, -50%);
        "
      <source src="${mainVideo}" type="video/mp4" />
      </video>`,
      }}
    />
  );
}
