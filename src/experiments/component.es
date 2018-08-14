import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default (name, variations, variationProps) => {
  const Experiment = ({ experiments }) => {
    const id = experiments[name];
    const Component = variations[id];
    const componentProps = variationProps[id];
    return <Component {...componentProps} />;
  };

  Experiment.propTypes = {
    experiments: PropTypes.object.isRequired,
  };

  Experiment.displayName = `Experiment(${name})`;

  const mapStateToProps = ({ experiments }) => ({ experiments });
  return connect(mapStateToProps, Experiment);
};
