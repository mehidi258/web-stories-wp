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
import { createRef, useEffect } from 'react';
import { __ } from '@web-stories-wp/i18n';
import styled from 'styled-components';
import JSZip from 'jszip';

/**
 * Internal dependencies
 */
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '../../../../design-system';
import { useMedia, useStory } from '../../../app';
import useAdStory from '../../../app/storyAd/useAdStory';
import { getResourceFromLocalFile } from '../../../app/media/utils';

const ImportButtonContainer = styled.div``;

function ImportButton() {
  const {
    internal: { reducerState, restore },
  } = useStory();
  const {
    actions: {
      updateCTALink,
      updateCtaText,
      updateCustomCtaText,
      updateLandingPageType,
      updateIsImportingStatus,
    },
    state: { isImporting },
  } = useAdStory();

  const { localStoryAdMedia, setLocalStoryAdMedia } = useMedia(
    ({
      local: {
        state: { localStoryAdMedia },
        actions: { setLocalStoryAdMedia },
      },
    }) => ({
      localStoryAdMedia,
      setLocalStoryAdMedia,
    })
  );

  const fileInputRef = createRef();
  let timeout = null;

  useEffect(() => () => clearTimeout(timeout), [timeout]);

  const handleFileInput = async () => {
    if (!event.target.files.length) {
      return;
    }

    const file = event.target.files[0];

    if ('application/zip' !== file.type) {
      return;
    }

    updateIsImportingStatus(true);

    const files = await JSZip.loadAsync(file).then((content) => content.files);

    const fileNames = Object.keys(files);
    const mediaFileNames = {
      image: [],
    };

    fileNames.forEach((fileName) => {
      Object.keys(mediaFileNames).forEach((fileType) => {
        if (0 === fileName.indexOf(fileType + '-')) {
          mediaFileNames[fileType].push(fileName);
        }
      });
    });

    const mediaItems = [...localStoryAdMedia];

    const configData = await files['config.json'].async('text');
    const importedState = JSON.parse(configData);

    const stateToRestore = {
      ...importedState,
      story: { ...reducerState.story, ...importedState.story },
      capabilities: reducerState.capabilities,
    };

    const { elements } = stateToRestore.pages[0] || {};

    await Promise.all(
      Object.keys(files).map(async (fileName) => {
        const currentFile = files[fileName];

        const elementIndex = elements.findIndex(
          (element) => element?.resource?.src === fileName
        );

        const { resource } = elementIndex >= 0 ? elements[elementIndex] : {};

        if (['image', 'video'].includes(resource?.type)) {
          const { alt, mimeType, title, width, height } = resource;
          const blob = await currentFile?.async('blob');
          const mediaFile = new File([blob], currentFile.name, {
            type: mimeType,
          });

          if (!mediaFile) {
            return;
          }

          const mediaItem = await getResourceFromLocalFile(mediaFile);

          if (mediaItem?.alt) {
            mediaItem.alt = alt || '';
          }

          if (mediaItem?.title) {
            mediaItem.title = title || '';
          }

          if (mediaItem?.height) {
            mediaItem.height = height;
          }

          if (mediaItem?.width) {
            mediaItem.width = width;
          }

          mediaItem.local = false;

          elements[elementIndex].resource.src = mediaItem.src;

          mediaItems.push(mediaItem);
        }
      })
    );

    setLocalStoryAdMedia(mediaItems);

    if (stateToRestore.storyAd) {
      updateCTALink(stateToRestore.storyAd.ctaLink);
      updateCtaText(stateToRestore.storyAd.ctaText);
      updateCustomCtaText(stateToRestore.storyAd.customCtaText);
      updateLandingPageType(stateToRestore.storyAd.landingPageType);
    }

    restore(stateToRestore);

    // Timeout because it takes some time for the layers to settle on the canvas.
    timeout = setTimeout(() => updateIsImportingStatus(false), 800);
  };

  return (
    <ImportButtonContainer>
      <input type="file" ref={fileInputRef} onChange={handleFileInput} hidden />
      <Button
        variant={BUTTON_VARIANTS.RECTANGLE}
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.SMALL}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        disabled={isImporting}
      >
        {__('Import Zip', 'web-stories')}
      </Button>
    </ImportButtonContainer>
  );
}

export default ImportButton;
