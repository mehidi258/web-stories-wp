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
import { useState } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Button, BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS } from '../../../../design-system';
import { useStory } from '../../../app';
import useAdStory from '../../../app/storyAd/useAdStory';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import getStoryPropsToSave from '../../../app/story/utils/getStoryPropsToSave';
import { DATA_VERSION } from '@web-stories-wp/migration';

function DownloadZip() {
  const [isDownloading, setIsDownloading] = useState(false);
  const {
    internal: { reducerState },
  } = useStory();

  const {
    pages,
    current,
    selection,
    story,
  } = reducerState;

  const storyData = {
    current,
    selection,
    story: { globalStoryStyles: story?.globalStoryStyles },
    version: DATA_VERSION,
    pages,
  };

  const currentPage = pages[0];

  const {
    state: { ctaLink, ctaText, landingPageType },
  } = useAdStory();

  const zipStoryAd = async ( storyContent ) => {
    let markup = `<!doctype html>${ storyContent }`;
    const imageUrls = [];

    currentPage.elements.forEach( ( element ) => {
      if ( 'image' === element.type ) {
        imageUrls.push( element.resource.src );
      }
    } );

    const zip = new JSZip();

    zip.file( 'config.json', JSON.stringify( storyData ) );

    await Promise.all( imageUrls.map( async ( url, index ) => {
      const imageResponse = await fetch( url );
      const imageBlob = await imageResponse.blob();
      const imageName = `image-${ index + 1 }.png`;
      const imageFile = new File( [ imageBlob ], imageName );

      const encodedUrl = url.replaceAll( '&', '&amp;' ); // To match url in the rendered markup.
      markup = markup.replace( encodedUrl, imageName );

      zip.file( imageName, imageFile );
    } ) );

    zip.file( 'index.html', markup );
    zip.file( 'README.txt', 'TBD' );

    zip.generateAsync( { type: 'blob' } ).then( ( content ) => {
      saveAs( content, 'story-ad.zip' );
    } );
  };

  const download = async () => {
    const storyAd = { ctaLink, ctaText, landingPageType };

    await setIsDownloading( true );

    const storyProps = getStoryPropsToSave( { story, pages, metadata: {}, flags: {}, storyAd } );
    await zipStoryAd( storyProps.content );

    await setIsDownloading( false );
  };

  return (
    <Button
      variant={BUTTON_VARIANTS.RECTANGLE}
      type={BUTTON_TYPES.PRIMARY}
      size={BUTTON_SIZES.SMALL}
      onClick={download}
      disabled={isDownloading}
    >
      { __('Download Zip', 'web-stories') }
    </Button>
  );
}

export default DownloadZip;
