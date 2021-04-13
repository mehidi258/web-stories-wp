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

/**
 * Internal dependencies
 */
import { __ } from '@web-stories-wp/i18n';
import { useRef, useState } from 'react';
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

const FieldRow = styled(Row)`
  margin-bottom: 12px;
`;

const FieldRowButton = styled(Row)`
  margin-bottom: 12px;
  justify-content: flex-end;
`;

const ctaOptions = [
  {
    label: __('Apply Now', 'web-stories'),
    value: 'APPLY_NOW',
  },
  {
    label: __('Book', 'web-stories'),
    value: 'BOOK_NOW',
  },
  {
    label: __('Buy Tickets', 'web-stories'),
    value: 'BUY_TICKETS',
  },
  {
    label: __('Download', 'web-stories'),
    value: 'DOWNLOAD',
  },
  {
    label: __('Explore Now', 'web-stories'),
    value: 'EXPLORE',
  },
  {
    label: __('Get Now', 'web-stories'),
    value: 'GET_NOW',
  },
  {
    label: __('Install Now', 'web-stories'),
    value: 'INSTALL',
  },
  {
    label: __('Listen Now', 'web-stories'),
    value: 'LISTEN',
  },
  {
    label: __('More', 'web-stories'),
    value: 'MORE',
  },
  {
    label: __('Open App', 'web-stories'),
    value: 'OPEN_APP',
  },
  {
    label: __('Order Now', 'web-stories'),
    value: 'ORDER_NOW',
  },
  {
    label: __('Play', 'web-stories'),
    value: 'PLAY',
  },
  {
    label: __('Read Now', 'web-stories'),
    value: 'READ',
  },
  {
    label: __('Shop Now', 'web-stories'),
    value: 'SHOP',
  },
  {
    label: __('Showtimes', 'web-stories'),
    value: 'SHOWTIMES',
  },
  {
    label: __('Sign Up', 'web-stories'),
    value: 'SIGN_UP',
  },
  {
    label: __('Subscribe Now', 'web-stories'),
    value: 'SUBSCRIBE',
  },
  {
    label: __('Use App', 'web-stories'),
    value: 'USE_APP',
  },
  {
    label: __('View', 'web-stories'),
    value: 'VIEW',
  },
  {
    label: __('Watch', 'web-stories'),
    value: 'WATCH',
  },
  {
    label: __('Watch Episode', 'web-stories'),
    value: 'WATCH_EPISODE',
  },
];

const landPageOptions = [
  {
    label: __('Sponsored Story', 'web-stories'),
    value: 'STORY',
  },
  {
    label: __('AMP Page', 'web-stories'),
    value: 'AMP',
  },
  {
    label: __('Any Webpage', 'web-stories'),
    value: 'NONAMP',
  },
];

function StoryAdPanel() {
  const {
    actions: { getStoryById },
  } = useAPI();
  const [showTextArea, setTextAreaVisibility] = useState(false);
  const [content, setContent] = useState('');
  const [copyText, setCopyText] = useState('Copy Markup');
  const textAreaRef = useRef();

  const { updateStory, saveStory, story } = useStory(
    ({ actions: { updateStory, saveStory }, state: { story } }) => ({
      updateStory,
      saveStory,
      story,
    })
  );

  const getContent = async () => {
    await saveStory();

    if (story && story.storyId) {
      const post = await getStoryById(story.storyId);
      await setContent(post.content.raw);
    }
  };

  const [ctaLink, setCTALink] = useState('');
  const [selectedCtaText, setSelectedCtaText] = useState(ctaOptions[2].value);
  const [selectedLandingPageType, setSelectedPageLandingType] = useState(
    landPageOptions[1].value
  );

  const updateValues = () => {
    updateStory({
      properties: {
        ctaLink,
        ctaText: selectedCtaText,
        landingPageType: selectedLandingPageType,
      },
    });
  };

  const exportStoryAd = () => {
    updateValues();
    getContent();
    setTextAreaVisibility(true);
  };

  const handleChange = (event) => setCTALink(event.currentTarget.value);
  const copyMarkup = () => {
    textAreaRef.current.select();
    document.execCommand('copy');
    setCopyText('Copied');
  };

  return (
    <SimplePanel
      name="story-ad"
      title={__('Story Ad', 'web-stories')}
      collapsedByDefault
    >
      <FieldRow>
        <Input
          value={ctaLink}
          onChange={handleChange}
          placeholder={__('Enter CTA Link', 'web-stories')}
          aria-label={__('CTA Link', 'web-stories')}
        />
      </FieldRow>

      <FieldRow>
        <DropDown
          emptyText={__('No options available', 'web-stories')}
          options={ctaOptions}
          hasError={false}
          hint={''}
          placeholder={__('Select CTA Text', 'web-stories')}
          dropDownLabel={__('CTA Text', 'web-stories')}
          isKeepMenuOpenOnSelection={false}
          isRTL={false}
          selectedValue={selectedCtaText}
          onMenuItemClick={(event, newValue) => {
            setSelectedCtaText(newValue);
          }}
          placement={PLACEMENT.BOTTOM}
        />
      </FieldRow>

      <FieldRow>
        <DropDown
          emptyText={__('No options available', 'web-stories')}
          options={landPageOptions}
          hasError={false}
          hint={''}
          placeholder={__('Select Landing Page Type', 'web-stories')}
          dropDownLabel={__('Landing Page Type', 'web-stories')}
          isKeepMenuOpenOnSelection={false}
          isRTL={false}
          selectedValue={selectedLandingPageType}
          onMenuItemClick={(event, newValue) => {
            setSelectedPageLandingType(newValue);
          }}
          placement={PLACEMENT.BOTTOM}
        />
      </FieldRow>
      <FieldRow>
        <Button
          type={BUTTON_TYPES.SECONDARY}
          variant={BUTTON_VARIANTS.RECTANGLE}
          size={BUTTON_SIZES.SMALL}
          onClick={exportStoryAd}
        >
          {__('Export', 'web-stories')}
        </Button>
      </FieldRow>
      {showTextArea ? (
        <>
          <FieldRow>
            <TextArea
              onChange={() => {}}
              value={content}
              ref={textAreaRef}
              aria-label={__('Ad Markup', 'web-stories')}
            />
          </FieldRow>
          <FieldRowButton>
            <Button
              type={BUTTON_TYPES.SECONDARY}
              variant={BUTTON_VARIANTS.RECTANGLE}
              size={BUTTON_SIZES.SMALL}
              onClick={copyMarkup}
            >
              {copyText}
            </Button>
          </FieldRowButton>
        </>
      ) : null}
    </SimplePanel>
  );
}

export default StoryAdPanel;
