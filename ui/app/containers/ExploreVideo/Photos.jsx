import React from 'react';
import PhotoListItem from './PhotoListItem';

export default function PhotoList(props) {
  const {
    onPhotoSelect,
    photos,
  } = props;

  const photoItems = photos.map((photo, index) => <PhotoListItem index={index} onPhotoSelect={onPhotoSelect} photo={photo} />);

  return (
    <nav id="photo-list" style={{width: "600px"}}>
      <Container>
        <Row>
          <Col>{photoItems}</Col>
        </Row>
        </Container>
    </nav>
  );
}
