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
import styled from 'styled-components';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Internal dependencies
 */
import { __ } from '@web-stories-wp/i18n';
import { useEffect, useRef, useState } from 'react';
import { SimplePanel } from '../../panel';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  DropDown,
  Input,
  PLACEMENT,
  TextArea,
} from '../../../../../design-system';
import { Row } from '../../../form';
import { useAPI, useStory } from '../../../../app';
import useAdStory from '../../../../app/storyAd/useAdStory';
import { ctaOptions, landPageOptions } from './selectorOptions';
import getStoryPropsToSave from '../../../../app/story/utils/getStoryPropsToSave';

const FieldRow = styled( Row )`
  margin-bottom: 12px;
`;

const FieldRowButton = styled( Row )`
  margin-bottom: 12px;
  justify-content: flex-end;
`;

function StoryAdPanel() {
  const [ showTextArea, setTextAreaVisibility ] = useState( false );
  const [ content, setContent ] = useState( '' );
  const [ copyText, setCopyText ] = useState( 'Copy Markup' );
  const textAreaRef = useRef();

  const { story, pages, currentPage } = useStory(
    ( { state: { story, pages, currentPage } } ) => ( {
      story,
      pages,
      currentPage,
    } ),
  );

  const {
    actions: { updateCTALink, updateCtaText, updateLandingPageType },
    state: { ctaLink, ctaText, landingPageType },
  } = useAdStory();

  const zipStoryAd = async ( storyContent ) => {
    let markup = `<!doctype html>${ storyContent }`;
    await setContent( markup );

    const imageUrls = [];

    currentPage.elements.forEach( ( element ) => {
      if ( 'image' === element.type ) {
        imageUrls.push( element.resource.src );
      }
    } );

    const zip = new JSZip();

    zip.file( 'config.json', JSON.stringify( {
      currentPage,
      story
    } ) );

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

  const saveAndFetchContent = async () => {
    const storyAd = { ctaLink, ctaText, landingPageType };
    const storyProps = getStoryPropsToSave( { story, pages, metadata: {}, flags: {}, storyAd } );
    await zipStoryAd( storyProps.content );
  };

  useEffect( () => {
    setCopyText( 'Copy Markup' );
  }, [ ctaText, ctaLink, landingPageType ] );

  const exportStoryAd = async () => {
    await saveAndFetchContent();
    await setTextAreaVisibility( true );
  };

  const handleCTALinkChange = ( event ) => {
    let link = event.currentTarget.value;

    link = ( link.indexOf( '://' ) === -1 ) ? 'https://' + link : link;

    updateCTALink( link );
  };

  const copyMarkup = () => {
    textAreaRef.current.select();
    document.execCommand( 'copy' );
    setCopyText( 'Copied' );
  };

  return (
    <SimplePanel
      name="story-ad"
      title={ __( 'Story Ad', 'web-stories' ) }
      collapsedByDefault
    >
      <FieldRow>
        <Input
          value={ ctaLink }
          onChange={ handleCTALinkChange }
          placeholder={ __( 'Enter CTA Link', 'web-stories' ) }
          aria-label={ __( 'CTA Link', 'web-stories' ) }
        />
      </FieldRow>

      <FieldRow>
        <DropDown
          emptyText={ __( 'No options available', 'web-stories' ) }
          options={ ctaOptions }
          hasError={ false }
          hint={ '' }
          placeholder={ __( 'Select CTA Text', 'web-stories' ) }
          dropDownLabel={ __( 'CTA Text', 'web-stories' ) }
          isKeepMenuOpenOnSelection={ false }
          isRTL={ false }
          selectedValue={ ctaText }
          onMenuItemClick={ ( event, newValue ) => {
            updateCtaText( newValue );
          } }
          placement={ PLACEMENT.BOTTOM }
        />
      </FieldRow>

      <FieldRow>
        <DropDown
          emptyText={ __( 'No options available', 'web-stories' ) }
          options={ landPageOptions }
          hasError={ false }
          hint={ '' }
          placeholder={ __( 'Select Landing Page Type', 'web-stories' ) }
          dropDownLabel={ __( 'Landing Page Type', 'web-stories' ) }
          isKeepMenuOpenOnSelection={ false }
          isRTL={ false }
          selectedValue={ landingPageType }
          onMenuItemClick={ ( event, newValue ) => {
            updateLandingPageType( newValue );
          } }
          placement={ PLACEMENT.BOTTOM }
        />
      </FieldRow>
      <FieldRow>
        <Button
          type={ BUTTON_TYPES.SECONDARY }
          variant={ BUTTON_VARIANTS.RECTANGLE }
          size={ BUTTON_SIZES.SMALL }
          onClick={ exportStoryAd }
        >
          { __( 'Export', 'web-stories' ) }
        </Button>
      </FieldRow>
      { showTextArea ? (
        <>
          <FieldRow>
            <TextArea
              onChange={ () => {
              } }
              value={ content }
              ref={ textAreaRef }
              aria-label={ __( 'Ad Markup', 'web-stories' ) }
            />
          </FieldRow>
          <FieldRowButton>
            <Button
              type={ BUTTON_TYPES.SECONDARY }
              variant={ BUTTON_VARIANTS.RECTANGLE }
              size={ BUTTON_SIZES.SMALL }
              onClick={ copyMarkup }
            >
              { copyText }
            </Button>
          </FieldRowButton>
        </>
      ) : null }
    </SimplePanel>
  );
}

export default StoryAdPanel;
