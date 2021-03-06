/* global describe, expect, test */

import {
  selectHome,
  makeSelectGalleries,
  makeSelectGalleryLoading,
  makeSelectGalleryError,
} from '../selectors';

describe('selectHome', () => {
  test('should select the home state', () => {
    const homeState = {
      contents: {},
    };
    const mockedState = {
      home: homeState,
    };
    expect(selectHome(mockedState)).toEqual(homeState);
  });
});

describe('makeSelectGalleries', () => {
  const galleriesSelector = makeSelectGalleries();
  test('should select the gallery', () => {
    const contents = ['entity'];
    const mockedState = {
      home: {
        contents,
      },
    };
    expect(galleriesSelector(mockedState)).toEqual(contents);
  });
});

describe('makeSelectGalleryLoading', () => {
  const galleryLoadingSelector = makeSelectGalleryLoading();
  test('should select the loading status', () => {
    const galleryLoading = true;
    const mockedState = {
      home: {
        galleryLoading,
      },
    };
    expect(galleryLoadingSelector(mockedState)).toEqual(galleryLoading);
  });
});

describe('makeSelectGalleryError', () => {
  const galleryErrorSelector = makeSelectGalleryError();
  test('should select the error status', () => {
    const galleryError = true;
    const mockedState = {
      home: {
        galleryError,
      },
    };
    expect(galleryErrorSelector(mockedState)).toEqual(galleryError);
  });
});
