/**
 * Internal dependencies
 */
import { identity, useContextSelector } from '../../../design-system';
import Context from './context';

function useAdStory( selector ) {
  return useContextSelector(Context, selector ?? identity);
}

export default useAdStory;
