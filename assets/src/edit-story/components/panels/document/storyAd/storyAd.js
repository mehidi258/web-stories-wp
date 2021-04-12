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
import { useState } from 'react';
import { SimplePanel } from '../../panel';
import {
  DropDown,
  Input,
  PLACEMENT,
  ThemeGlobals,
} from '../../../../../design-system';
import { Row } from '../../../form';
import { MIN_MAX } from '../slug/slug';

const PermalinkRow = styled(Row)`
  margin-bottom: 12px;

  input {
    color: ${({ theme }) => theme.colors.fg.tertiary};
    :active,
    :focus,
    .${ThemeGlobals.FOCUS_VISIBLE_SELECTOR} {
      color: ${({ theme }) => theme.colors.fg.primary};
    }
  }
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

function StoryAdPanel() {
  const [selectedValue, setSelectedValue] = useState(ctaOptions[2].value);

  const handleChange = function () {};

  const handleBlur = function () {};

  const ctaLink = '';

  return (
    <SimplePanel
      name="story-ad"
      title={__('Story Ad', 'web-stories')}
      collapsedByDefault
    >
      <PermalinkRow>
        <Input
          value={ctaLink}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={__('Enter CTA Link', 'web-stories')}
          aria-label={__('CTA Link', 'web-stories')}
          minLength={MIN_MAX.PERMALINK.MIN}
          maxLength={MIN_MAX.PERMALINK.MAX}
        />
      </PermalinkRow>

      <DropDown
        emptyText={__('No options available', 'web-stories')}
        options={ctaOptions}
        hasError={false}
        hint={''}
        placeholder={__('Select CTA Text', 'web-stories')}
        dropDownLabel={__('CTA Text', 'web-stories')}
        isKeepMenuOpenOnSelection={false}
        isRTL={false}
        selectedValue={selectedValue}
        onMenuItemClick={(event, newValue) => {
          setSelectedValue(newValue);
        }}
        placement={PLACEMENT.BOTTOM}
      />
    </SimplePanel>
  );
}

export default StoryAdPanel;
