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
import { activatePlugin, deactivatePlugin } from '@wordpress/e2e-test-utils';

/**
 * External dependencies
 */
import { visitSettings } from '@web-stories-wp/e2e-test-utils';

describe('Site Kit integration with dashboard', () => {
  beforeAll(async () => {
    await activatePlugin('e2e-tests-site-kit-mock');
  });

  afterAll(async () => {
    await deactivatePlugin('e2e-tests-site-kit-mock');
  });

  it('should be able see Site Kit specific message', async () => {
    await visitSettings();

    await expect(page).toMatch(
      'Site Kit by Google has already enabled Google Analytics for your Web Stories'
    );
  });
});
