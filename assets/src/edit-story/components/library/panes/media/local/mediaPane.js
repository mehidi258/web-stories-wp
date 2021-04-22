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
import { createRef, useState } from 'react';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Button, BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS } from '../../../../../../design-system';
import { MediaGalleryMessage, PaneHeader as DefaultPaneHeader, PaneInner, StyledPane } from '../common/styles';
import { PANE_PADDING } from '../../shared';
import paneId from './paneId';

export const ROOT_MARGIN = 300;

const FilterArea = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 ${PANE_PADDING} 0 ${PANE_PADDING};
`;

const PaneHeader = styled( DefaultPaneHeader )`
  padding: ${PANE_PADDING} 0 ${PANE_PADDING} 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
`;

const MediaListArea = styled.div`
  padding: 1em;
`;

function MediaItem( { mediaItem } ) {
    return (
      <img src={ mediaItem.src } alt="" width="100%" />
    );
}

function MediaList( { media } ) {

  return (
    <MediaListArea>
      { media.map( ( mediaItem ) => <MediaItem key={ mediaItem.name } mediaItem={ mediaItem } /> ) }
    </MediaListArea>
  );
}

function MediaPane(props) {
  const [ media, setMedia ] = useState( [] );
  const fileInputRef = createRef();

  const handleFileInput = ( event ) => {
    if ( ! event.target.files.length ) {
      return;
    }

    const file = event.target.files[0];
    const { name, size, type } = file;
    const src = URL.createObjectURL( file );
    const mediaItems = [ ...media ];

    mediaItems.push( {
      src,
      name,
      size,
      type
    } );

    setMedia( mediaItems );
  };

  return (
    <StyledPane id={paneId} {...props}>
      <PaneInner>
        <PaneHeader>
          <FilterArea>
            <input type="file" ref={ fileInputRef } onChange={handleFileInput} hidden />
            <Button
              variant={BUTTON_VARIANTS.RECTANGLE}
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
              onClick={ () => fileInputRef.current && fileInputRef.current.click() }
            >
              {__('Upload', 'web-stories')}
            </Button>
          </FilterArea>
        </PaneHeader>

        { ! media.length ? (
          <MediaGalleryMessage>
            { __( 'No media found', 'web-stories' ) }
          </MediaGalleryMessage>
        ) : (
          <MediaList
            media={ media }
          />
        )}
      </PaneInner>
    </StyledPane>
  );
}

export default MediaPane;
