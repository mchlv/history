import React from 'react';
import styled from 'styled-components';
import Photos from './Photos';


function handleKeyPress(event) {
  if (event.key === 'Enter') {
    event.target.click();
  }
}
// these are props that are getting passed in by the partent - the partent needs to provide the index, video and onVideoSelect.
export default function PhotoListItem({ index, photo }) {
  // const tabOffset = 2;

  // getting data from youtube, provided to us, dot syntax to get us to the thumbnail path.
  const imageUrl = photo.src;

  const PhotoListItem = styled.li`
    list-style: none;
    margin: 20px;
    float: left;
  `

  return (
    // these are the thumbnails you can tell by the alt tag
    <PhotoListItem className="photo-list-media"  onClick={() => onPhotoSelect(video)} onKeyPress={handleKeyPress}  role="button">
        <img src={imageUrl} alt="photo thumbnail" style={{width: "400px"}} />
      </PhotoListItem>
  );
}
