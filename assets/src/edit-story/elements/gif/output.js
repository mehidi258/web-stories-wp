/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import MediaOutput from '../media/output';

function defaultForUndefined(value, def) {
  return value === undefined ? def : value;
}

function GifOutput({ element, box }) {
  const { resource } = element;

  const sourceProps = {
    type: resource.output.mimeType,
    src: resource.output.src,
  };

  const props = {
    autoPlay: 'autoplay',
    poster: '',
    title: defaultForUndefined(element.title, resource.title),
    alt: defaultForUndefined(element.alt, resource.alt),
    layout: 'fill',
    loop: 'loop',
    noaudio: 'noaudio',
  };

  // crossorigin='anonymous' is required to play videos from other domains.
  return (
    <MediaOutput element={element} box={box}>
      <amp-video {...props} id={`el-${element.id}-media`}>
        <source {...sourceProps} />
      </amp-video>
    </MediaOutput>
  );
}

GifOutput.propTypes = {
  element: StoryPropTypes.elements.gif.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default GifOutput;
