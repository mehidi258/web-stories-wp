import Context from './context';
import { useState } from 'react';
import PropTypes from 'prop-types';

function StoryAdProvider( {children} ) {
  const [ ctaLink, updateCTALink ] = useState( '' );
  const [ ctaText, updateCtaText ] = useState( 'ORDER_NOW' );
  const [ landingPageType, updateLandingPageType ] = useState( 'AMP' );
  const [ screenshot, updateScreenshot ] = useState( '' );

  const value = {
    actions: {
      updateCTALink,
      updateCtaText,
      updateLandingPageType,
      updateScreenshot,
    },
    state: {
      ctaLink,
      ctaText,
      landingPageType,
      screenshot,
    }
  };

  return (
    <Context.Provider value={ value } >
      {children}
    </Context.Provider>
  )
}

StoryAdProvider.propType = {
  children: PropTypes.node.isRequired,
};

export default StoryAdProvider;
