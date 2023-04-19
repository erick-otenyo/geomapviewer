import React from 'react';
import PropTypes from 'prop-types';

import NoContent from '@/components/ui/no-content';
import Button from '@/components/ui/button';

import './styles.scss';

const RefreshButton = ({ refetchFn }) => (
  <NoContent className="c-refresh-button">
    <span>An error occured while fetching data. You can try again, or save the shape and check back tomorrow.</span>
    <Button
      className="refresh-btn"
      onClick={refetchFn}
      theme="theme-button-small"
    >
      Try again
    </Button>
  </NoContent>
);

RefreshButton.propTypes = {
  refetchFn: PropTypes.func
};

RefreshButton.defaultProps = {
  refetchFn: () => {}
};

export default RefreshButton;
