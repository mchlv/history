/* global describe, expect, test */
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import App from '..';

const renderer = new ShallowRenderer();

describe('<App />', () => {
  test('should render and match the snapshot', () => {
    renderer.render(<App />);
    const renderedOutput = renderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
