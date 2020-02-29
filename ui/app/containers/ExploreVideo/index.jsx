/* global fetch */
import React, { useState } from 'react';
import _ from 'lodash';

import SearchBar from './SearchBar';
import VideoList from './VideoList';
import Photos from './Photos';
import VideoDetail from './VideoDetail';
import PhotoList from './PhotoList';

const API_KEY = process.env.HISTORY_YOUTUBE_API_KEY;
const flickrAPI_KEY = process.env.HISTORY_FLICKR_API_KEY;
// ExploreVideo
// both pics and videos
export default function ExploreVideo() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, selectVideo] = useState(null);

  const fetchVideos = async (searchValue, options = {}) => {
    if (!searchValue) {
      return undefined;
    }

    const order = (options.searchOrder) ? `&order=${options.searchOrder}` : '';

    const geoAddress = `https://content.googleapis.com/youtube/v3/search?location=${searchValue}&locationRadius=1km&maxResults=5${order}`
     + `&part=id,snippet&type=video&videoEmbeddable=true&key=${API_KEY}&videoLiscense=any`;
    const keywordAddress = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${API_KEY}&q=${searchValue}&type=video${order}`;

    const address = (Number(searchValue.split(',')[0])) ? geoAddress : keywordAddress;

    try {
      const response = await fetch(address);
      const payload = await response.json();
      setVideos(payload.items);
      selectVideo(payload.items[0]);
    }
    catch (error) {
      return console.debug(error.message);
    }
  };

  const videoSearch = _.debounce((searchValue, options) => fetchVideos(searchValue, options), 400);
  
  const [photos, setPhotos] = useState([]);

  const fetchPhotos = async (searchValue = {}) => {
    if (!searchValue) {
      return undefined;
    }

    const location = {
      latitude: 49.37885,
      longitude: 10.18711,
    };

    const method = 'flickr.photos.search';
    const params = `&lat=${location.latitude}&lon=${location.longitude}&radius=1`;

    const flickrgeoAddress = `https://www.flickr.com/services/rest/?${params}&method=${method}&api_key=54e3566e2843b8541e36ae78ef4d2ac8&per_page=5&page=1&format=json&nojsoncallback=1`;
    const flickrkeywordAddress = `https://www.flickr.com/services/rest/?method=${method}&api_key=54e3566e2843b8541e36ae78ef4d2ac8&tags=${searchValue}&per_page=5&page=1&format=json&nojsoncallback=1`;

    const address = (Number(searchValue.split(',')[0])) ? flickrgeoAddress : flickrkeywordAddress;

    const dimensions = 't'; 

    try {
      const response = await fetch(address);
      const payload = await response.json();
      const formatImage = (photo_1) => ({ src: `https://farm${photo_1.farm}.staticflickr.com/${photo_1.server}/${photo_1.id}_${photo_1.secret}_${dimensions}.jpg` });
      const photosrc = payload.photos.photo.map(formatImage);
      
      setPhotos(photosrc);
    }
    catch (error) {
      return console.debug(error.message);
    }
}
const photoSearch = _.debounce((searchValue, options) => fetchPhotos(searchValue, options), 400);


  return (
    <section id="media-component" style={{background: "grey", padding: "60px", color: "smoke"}}>
      <SearchBar onSearchChange={videoSearch}/>
      <SearchBar onSearchChange={photoSearch}/>
      <VideoDetail video={selectedVideo} />
      <VideoList onVideoSelect={selectVideo} videos={videos} />
      <PhotoList photos={photos} />
      
    </section>
  );
}
