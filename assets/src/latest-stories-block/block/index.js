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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ReactComponent as icon } from './icon.svg';
import metadata from './block';
import edit from './edit';
import save from './save';

const { name, category, attributes } = metadata;

const settings = {
  title: __('Latest Web Stories', 'web-stories'),
  description: __('Embed latest web stories.', 'web-stories'),
  category,
  icon,
  keywords: [
    /* translators: block keyword. */
    __('latest', 'web-stories'),
    /* translators: block keyword. */
    __('web', 'web-stories'),
    /* translators: block keyword. */
    __('story', 'web-stories'),
  ],
  attributes,
  example: {
    // TODO: Replace with something custom.
    attributes: {
      viewType: 'grid',
      title: __('Stories in AMP', 'web-stories'),
      numOfStories: 1,
      numOfColumns: 2,
      isShowingTitle: true,
      isShowingAuthor: true,
      isShowingStoryPlayer: false,
    },
  },
  supports: {
    align: ['wide', 'full'],
  },
  edit,
  save,
};

export { metadata, name, icon, settings };
