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
import { useCallback, useState } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Button, BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS } from '../../../../design-system';

function DownloadZip() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(() => {

  }, []);

  return (
    <Button
      variant={BUTTON_VARIANTS.RECTANGLE}
      type={BUTTON_TYPES.PRIMARY}
      size={BUTTON_SIZES.SMALL}
      onClick={handleDownload}
      disabled={isDownloading}
    >
      { __('Download Zip', 'web-stories') }
    </Button>
  );
}

export default DownloadZip;
