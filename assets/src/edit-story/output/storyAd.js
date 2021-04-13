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
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../types';

function OutputStoryAd({
  story: {
    featuredMedia: { url: featuredMediaUrl },
  },
  metadata: { publisher },
  storyAd,
}) {

  const { ctaLink, ctaText, landingPageType, screenshot } = storyAd || {};

  console.log( ctaLink, ctaText, landingPageType, screenshot );

  return (
    <html amp4ads="" lang="en">
    <head>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width" />
      <script async src="https://cdn.ampproject.org/amp4ads-v0.js" />
      <style
        amp4ads-boilerplate=""
        dangerouslySetInnerHTML={ {
          __html: `body { visibility: hidden }`
        } }
      />
      <noscript>
        <style
          amp-boilerplate=""
          dangerouslySetInnerHTML={ {
            __html: `
            body {
              -webkit - animation: none;
              -moz-animation: none;
              -ms-animation: none;
              animation: none
            }`
          } }
        />
      </noscript>
      <meta name="amp-cta-type" content={ ctaText }/>
      <meta name="amp-cta-url" content={ ctaLink }  />
      <meta name="amp-cta-landing-page-type" content={ landingPageType } />
      <style
        amp-custom
        dangerouslySetInnerHTML={ {
          __html: `
            .container {
              background: url( ${ screenshot } );
              width: 100%;
              height: 100%;
              background-size: cover;
              background-repeat: no-repeat;
            }`
        } }
      />
    </head>
    <body>
      <div className="container" />
    </body>
    </html>
  );
}

OutputStoryAd.propTypes = {
  story: StoryPropTypes.story.isRequired,
  pages: PropTypes.arrayOf(StoryPropTypes.page).isRequired,
  metadata: PropTypes.shape({
    publisher: PropTypes.shape({
      name: PropTypes.string.isRequired,
      logo: PropTypes.string,
    }),
  }).isRequired,
};

export default OutputStoryAd;
