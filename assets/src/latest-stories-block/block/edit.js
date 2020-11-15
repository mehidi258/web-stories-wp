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
import PropTypes from 'prop-types';
import classNames from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import { debounce } from 'lodash'; // @TODO: Remove 'lodash' dependency.

/**
 * WordPress dependencies
 */
import { useEffect, useState, RawHTML } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { Notice } from '@wordpress/components';

/**
 * Internal dependencies
 */
import StoryPlayer from './storyPlayer';
import LatestStoriesControls from './latestStoriesControls';
import LatestStoriesPlaceholder from './latestStoriesPlaceholder';

import './edit.css';

const LATEST_STORIES_QUERY = {
  per_page: -1,
};

const LatestStoriesEdit = ({ attributes, setAttributes }) => {
  const {
    align,
    viewType,
    numOfStories,
    numOfColumns,
    orderByValue,
    isShowingTitle,
    isShowingDate,
    isShowingAuthor,
    isShowingViewAll,
    viewAllLinkLabel,
    isShowingStoryPoster,
    carouselSettings,
    authors,
    listViewImageAlignment,
  } = attributes;

  const [fetchedStories, setFetchedStories] = useState([]);
  const [fetchedAuthors, setFetchedAuthors] = useState([]);
  const [isFetchingStories, setIsFetchingStories] = useState([]);
  const previewLink = wp.data.select('core/editor').getEditedPostPreviewLink();
  const carouselMessage = sprintf(
    /* Translators: Carousel informational message. 1: Preview link. */
    __(
      `<i><b>Note:</b> Carousel view's functionality will not work in Editor. <a target="__blank" href="%1$s">Preview</a> post to see it in action.</i>`,
      'web-stories'
    ),
    previewLink
  );
  const fetchLatestStories = async () => {
    try {
      setIsFetchingStories(true);
      const stories = await apiFetch({
        path: addQueryArgs('/web-stories/v1/web-story', LATEST_STORIES_QUERY),
      });

      if (Array.isArray(stories)) {
        setFetchedStories(stories);
      }
    } catch (err) {
      // Temporarily disabled, need to show UI message.
      console.log(err); // eslint-disable-line no-console
    } finally {
      setIsFetchingStories(false);
    }
  };

  const debouncedFetchLatestStories = debounce(fetchLatestStories, 1000);

  useEffect(() => {
    apiFetch({
      path: addQueryArgs('/wp/v2/users', { per_page: -1 }),
    })
      .then((data) => {
        setFetchedAuthors(data);
      })
      .catch(() => {
        setFetchedAuthors([]);
      });
  }, [authors]);

  useEffect(() => {
    let order,
      orderBy = '';

    switch (orderByValue) {
      case 'old-to-new':
        orderBy = 'date';
        order = 'asc';
        break;
      case 'alphabetical':
        orderBy = 'title';
        order = 'asc';
        break;
      case 'reverse-alphabetical':
        orderBy = 'title';
        order = 'desc';
        break;
      case 'random':
        orderBy = 'rand';
        order = 'desc';
        break;
      default:
        orderBy = 'date';
        order = 'desc';
    }

    LATEST_STORIES_QUERY.author = authors.map((author) => author.id);
    LATEST_STORIES_QUERY.order = order;
    LATEST_STORIES_QUERY.orderby = orderBy;

    debouncedFetchLatestStories();
    /* Disabling below rule for single line isn't working for some reason. */
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [authors, orderByValue]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (numOfStories <= fetchedStories.length) {
      // No need to fetch stories when reducing number of stories.
      return;
    }

    LATEST_STORIES_QUERY.per_page = numOfStories;

    debouncedFetchLatestStories();
  }, [numOfStories]); /* eslint-disable-line react-hooks/exhaustive-deps */

  const willShowStoryPoster = 'grid' != viewType ? true : isShowingStoryPoster;
  const willShowDate = 'circles' === viewType ? false : isShowingDate;
  const willShowAuthor = 'circles' === viewType ? false : isShowingAuthor;
  const viewAllLabel = viewAllLinkLabel
    ? viewAllLinkLabel
    : __('View All Stories', 'web-stories');

  const storiesToDisplay =
    fetchedStories.length > numOfStories
      ? fetchedStories.slice(0, numOfStories)
      : fetchedStories;

  const alignmentClass = classNames({ [`align${align}`]: align });
  const blockClasses = classNames(
    'wp-block-web-stories-latest-stories latest-stories',
    { [`is-view-type-${viewType}`]: viewType }
  );
  const blockStyles = {
    gridTemplateColumns: `repeat(${numOfColumns}, 1fr)`,
  };

  return (
    <>
      <LatestStoriesControls
        viewType={viewType}
        numOfStories={numOfStories}
        numOfColumns={numOfColumns}
        orderByValue={orderByValue}
        isShowingTitle={isShowingTitle}
        isShowingDate={isShowingDate}
        isShowingAuthor={isShowingAuthor}
        isShowingViewAll={isShowingViewAll}
        viewAllLinkLabel={viewAllLinkLabel}
        isShowingStoryPoster={isShowingStoryPoster}
        carouselSettings={carouselSettings}
        authors={authors}
        listViewImageAlignment={listViewImageAlignment}
        setAttributes={setAttributes}
      />

      {isFetchingStories && <LatestStoriesPlaceholder />}

      {!isFetchingStories && storiesToDisplay && 0 < storiesToDisplay.length && (
        <div className={alignmentClass}>
          {'carousel' === viewType && (
            <Notice className="latest-stories-carousel-message">
              <RawHTML>{carouselMessage}</RawHTML>
            </Notice>
          )}
          <div className={blockClasses} style={blockStyles}>
            {storiesToDisplay.map((story) => {
              const author = fetchedAuthors.find(
                (singleAuthorObj) => story.author === singleAuthorObj.id
              );
              let title = '';

              if (story.title.rendered) {
                title =
                  'circles' === viewType && story.title.rendered.length > 45
                    ? `${story.title.rendered.substring(0, 45)}...`
                    : story.title.rendered;
              }

              return (
                <StoryPlayer
                  key={story.id}
                  url={story.link}
                  title={title}
                  date={story.date_gmt}
                  author={author ? author.name : ''}
                  poster={story.featured_media_url}
                  isShowingStoryPoster={willShowStoryPoster}
                  listViewImageAlignment={listViewImageAlignment}
                  isShowingAuthor={willShowAuthor}
                  isShowingDate={willShowDate}
                  isShowingTitle={isShowingTitle}
                />
              );
            })}
          </div>
          {isShowingViewAll && (
            <div className="latest-stories__archive-link">{viewAllLabel}</div>
          )}
        </div>
      )}
    </>
  );
};

LatestStoriesEdit.propTypes = {
  attributes: PropTypes.shape({
    align: PropTypes.string,
    viewType: PropTypes.string,
    numOfStories: PropTypes.number,
    numOfColumns: PropTypes.number,
    orderByValue: PropTypes.string,
    isShowingTitle: PropTypes.bool,
    isShowingDate: PropTypes.bool,
    isShowingAuthor: PropTypes.bool,
    isShowingViewAll: PropTypes.bool,
    viewAllLinkLabel: PropTypes.bool,
    isShowingStoryPoster: PropTypes.bool,
    carouselSettings: PropTypes.object,
    authors: PropTypes.array,
    listViewImageAlignment: PropTypes.string,
  }),
  setAttributes: PropTypes.func.isRequired,
};

export default LatestStoriesEdit;
