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
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { __, sprintf } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { Button, BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS, useSnackbar } from '../../../../../../design-system';
import { useConfig } from '../../../../../app/config';
import { useLocalMedia } from '../../../../../app/media';
import { useMediaPicker } from '../../../../mediaPicker';
import useLibrary from '../../../useLibrary';
import { getResourceFromMediaPicker } from '../../../../../app/media/utils';
import { MediaGalleryMessage, PaneHeader as DefaultPaneHeader, PaneInner, StyledPane } from '../common/styles';
import PaginatedMediaGallery from '../common/paginatedMediaGallery';
import resourceList from '../../../../../utils/resourceList';
import { PANE_PADDING } from '../../shared';
import MissingUploadPermissionDialog from './missingUploadPermissionDialog';
import paneId from './paneId';
import VideoOptimizationDialog from './videoOptimizationDialog';

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

function MediaPane(props) {
  const {
    hasMore,
    media,
    isMediaLoading,
    isMediaLoaded,
    mediaType,
    searchTerm,
    setNextPage,
    resetWithFetch,
    setMediaType,
    uploadVideoPoster,
    totalItems,
  } = useLocalMedia(
    ({
      state: {
        hasMore,
        media,
        isMediaLoading,
        isMediaLoaded,
        mediaType,
        searchTerm,
        totalItems,
      },
      actions: {
        setNextPage,
        resetWithFetch,
        setMediaType,
        setSearchTerm,
        uploadVideoPoster,
      },
    }) => {
      return {
        hasMore,
        media,
        isMediaLoading,
        isMediaLoaded,
        mediaType,
        searchTerm,
        totalItems,
        setNextPage,
        resetWithFetch,
        setMediaType,
        setSearchTerm,
        uploadVideoPoster,
      };
    }
  );

  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);

  const isSearching = searchTerm.length > 0;

  /**
   * Insert element such image, video and audio into the editor.
   *
   * @param {Object} resource Resource object
   * @return {null|*} Return onInsert or null.
   */
  const insertMediaElement = useCallback(
    (resource, thumbnailURL) => {
      resourceList.set(resource.id, {
        url: thumbnailURL,
        type: 'cached',
      });
      insertElement(resource.type, { resource });
    },
    [insertElement]
  );

  useEffect(() => {
    trackEvent('search', {
      search_type: 'media',
      search_term: searchTerm,
      search_filter: mediaType,
    });
  }, [searchTerm, mediaType]);

  return (
    <StyledPane id={paneId} {...props}>
      <PaneInner>
        <PaneHeader>
          <FilterArea>
            <Button
              variant={BUTTON_VARIANTS.RECTANGLE}
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
            >
              {__('Upload', 'web-stories')}
            </Button>
          </FilterArea>
        </PaneHeader>

        {isMediaLoaded && !media.length ? (
          <MediaGalleryMessage>
            { __( 'No media found', 'web-stories' ) }
          </MediaGalleryMessage>
        ) : (
          <PaginatedMediaGallery
            providerType="local"
            resources={media}
            isMediaLoading={isMediaLoading}
            isMediaLoaded={isMediaLoaded}
            hasMore={hasMore}
            onInsert={insertMediaElement}
            setNextPage={setNextPage}
            searchTerm={searchTerm}
          />
        )}

        <MissingUploadPermissionDialog
          open={isPermissionDialogOpen}
          onClose={() => setIsPermissionDialogOpen(false)}
        />
        <VideoOptimizationDialog />
      </PaneInner>
    </StyledPane>
  );
}

export default MediaPane;
