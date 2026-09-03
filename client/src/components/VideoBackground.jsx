// Full-screen looping nature video that sits BEHIND page content. Rendered as
// the first children of a `.nature-bg` container; positioning/z-index come from
// the `.video-bg` / `.video-overlay` rules in index.css so the video stays
// below the form and the dark-green overlay keeps the glass card readable.
// Purely decorative — hidden from assistive tech and non-interactive.
function VideoBackground() {
  return (
    <>
      <video
        className="video-bg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/sea-bg-1080.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay" aria-hidden="true" />
    </>
  );
}

export default VideoBackground;
