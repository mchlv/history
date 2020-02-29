import React from 'react';
import PhotoListItem from './PhotoListItem';

// this is the parent of VideoListIem.

export default function PhotoList(props) {
  const {
    photos,
  } = props;
  // map through the youtube videos and pass the props to the child component. Many youtube videos then we pass one video at a time.
  const photoItems = photos.map((photo, index) => <PhotoListItem index={index} photo={photo} key={photo.id} />);

  

  return (
    <div id="photo-list" style={{display: "inline-block", float: "right", width: "100px", position: "absolute"}}>
      {photoItems}
      
    </div>
  );
}
