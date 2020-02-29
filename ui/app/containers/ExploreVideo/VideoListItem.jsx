import React from 'react';
import styled from 'styled-components';


function handleKeyPress(event) {
  if (event.key === 'Enter') {
    event.target.click();
  }
}

export default function VideoListItem({ index, video, onVideoSelect }) {
  const tabOffset = 2;

  const imageUrl = video.snippet.thumbnails.default.url;

  const VideoListItem = styled.li`
    list-style: none;
    margin: 2rem;
    display: inline-block;
    float: left;
    `

  return (
  <VideoListItem>
    <div className="video-list-media" onClick={() => onVideoSelect(video)} onKeyPress={handleKeyPress} role="button" tabIndex={tabOffset + index}>
        <img src={imageUrl} alt="Video thumbnail" style={{width: "500px"}} />
      <div className="media-heading" style={{display: "block", width: "100%"}}>
        {video.snippet.title}
      </div>
      </div>
  </VideoListItem>
  );
}
