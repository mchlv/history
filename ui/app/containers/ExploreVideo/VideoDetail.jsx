import React from 'react';

export default function VideoDetail({ video }) {
  if (!video) {
    return (
      <section>
        Loading...
      </section>
    );
  }

  const { videoId } = video.id;
  const url = `https://www.youtube.com/embed/${videoId}`;

  return (
    <main id="video-detail">
      <section id="video-player">
        <iframe title="YouTube video player" src={url} style={{width: "100%", height: "70vh"}}/>
      </section>
      <section id="video-text">
        <div id="video-title" style={{width: "100%", padding: "20px", background: "white"}}>
          {video.snippet.title}
        </div>
        <div id="video-description" style={{width: "100%", padding: "20px", background: "white"}}>
          {video.snippet.description}
        </div>
      </section>
    </main>
  );
}
