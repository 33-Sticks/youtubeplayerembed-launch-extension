import React from 'react';
import { Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { deepAssign, filterObject, deepSetIfUndefined } from '../../../utils/formConfigUtils';
import { renderTextField, renderSelectField } from '../../../utils/uiMaterialUtils';
import MenuItem from 'material-ui/MenuItem';

const PLAYER_ID_TYPES = {
  DEFAULT: 'default',
  CUSTOM: 'custom'
};

const PlayerId = props => (
  <div className={ props.className }>
    <Field
      name="playerId.type"
      label="Player ID"
      className="u-gapLeft TimePlayed-unitSelect"
      component={ renderSelectField }
    >
      <MenuItem value={ PLAYER_ID_TYPES.DEFAULT } primaryText="Automatically generated" />
      <MenuItem value={ PLAYER_ID_TYPES.CUSTOM } primaryText="Custom" />
    </Field>
    {
      props.playerId.type === PLAYER_ID_TYPES.CUSTOM ?
        <Field
          label="ID"
          name="playerId.value"
          component={ renderTextField }
          supportDataElement
        /> : null
    }
  </div>
);

export default connect(state => ({
  playerId: {
    type: formValueSelector('default')(state, 'playerId.type')
  }
}))(PlayerId);

const fields = [
  'playerId.type',
  'playerId.value'
];

export const formConfig = {
  settingsToFormValues(values, settings) {
    values = deepAssign({}, values, filterObject(settings, fields));
    deepSetIfUndefined(values, 'playerId.type', PLAYER_ID_TYPES.DEFAULT);
    return values;
  },
  formValuesToSettings(settings, values) {
    settings = deepAssign({}, settings, filterObject(values, fields));

    const type = values.playerId.type;

    if (type !== PLAYER_ID_TYPES.CUSTOM) {
      delete settings.playerId.value;
    }

    return settings;
  },
  validate(errors, values) {
    const {
      type,
      value
    } = values.playerId || {};

    const componentsWithErrors = errors.componentsWithErrors ?
      errors.componentsWithErrors.slice() : [];

    if (type === PLAYER_ID_TYPES.CUSTOM && !value) {
      componentsWithErrors.push('videoDetailsExpanded');

      errors = {
        ...errors,
        playerId: {
          value: 'Please specify a player id'
        }
      };
    }

    return {
      ...errors,
      componentsWithErrors
    };
  }
};
