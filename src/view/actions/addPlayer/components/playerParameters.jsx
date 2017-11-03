import React from 'react';
import { Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { deepAssign, filterObject } from '../../../utils/formConfigUtils';
import { renderCheckbox, renderSelectField } from '../../../utils/uiMaterialUtils';
import MenuItem from 'material-ui/MenuItem';

const PlayerParameters = props => (
  <div>
    <Field
      className="u-block u-gapTop"
      name="parameters.autoPlay"
      component={ renderCheckbox }
      label="Automatically start the initial video to play when the player loads"
    />

    <Field
      className="u-block"
      name="parameters.ccLoadPolicy"
      component={ renderCheckbox }
      label="Show by default the closed captions"
    />

    <Field
      name="parameters.color"
      label="Player&quot;s video progress bar color"
      className="u-gapLeft TimePlayed-unitSelect"
      component={ renderSelectField }
    >
      <MenuItem value="red" primaryText="red" />
      <MenuItem value="white" primaryText="white" />
    </Field>

    <Field
      className="u-block"
      name="parameters.controls"
      component={ renderCheckbox }
      label="Display video player controls"
    />

    <Field
      className="u-block"
      name="parameters.disableKb"
      component={ renderCheckbox }
      label="Disable keyboard commands for this player"
    />

    <Field
      className="u-block"
      name="parameters.fs"
      component={ renderCheckbox }
      label="Show fullscreen button"
    />

    <Field
      className="u-block"
      name="parameters.showVideoAnnotations"
      component={ renderCheckbox }
      label="Show video annotations"
    />

    <Field
      className="u-block"
      name="parameters.loop"
      component={ renderCheckbox }
      label="Enable loop"
    />

    <Field
      className="u-block"
      name="parameters.modestBranding"
      disabled={ props.parameters.color === 'white' }
      component={ renderCheckbox }
      label="Prevent the YouTube logo from displaying in the control bar"
    />

    <Field
      className="u-block"
      name="parameters.rel"
      component={ renderCheckbox }
      label="Show related videos when playback of the initial video ends"
    />

    <Field
      className="u-block"
      name="parameters.showInfo"
      component={ renderCheckbox }
      label="Display the video title and the uploader name before the video starts playing"
    />
  </div>
);

export default connect(state => ({
  parameters: {
    color: formValueSelector('default')(state, 'parameters.color')
  }
}))(PlayerParameters);

const fieldNames = [
  'parameters.autoPlay',
  'parameters.ccLoadPolicy',
  'parameters.color',
  'parameters.controls',
  'parameters.disableKb',
  'parameters.fs',
  'parameters.showVideoAnnotations',
  'parameters.loop',
  'parameters.modestBranding',
  'parameters.rel',
  'parameters.showInfo'
];

export const formConfig = {
  settingsToFormValues(values, settings, meta) {
    values = deepAssign({}, values, filterObject(settings, fieldNames));

    return {
      ...values,
      parameters: {
        ...values.parameters,
        color: meta.isNew || !values.parameters.color ? 'red' : values.parameters.color,
        controls: !values.parameters || values.parameters.controls !== false,
        fs: !values.parameters || values.parameters.fs !== false,
        showVideoAnnotations:
          !values.parameters || values.parameters.showVideoAnnotations !== false,
        rel: !values.parameters || values.parameters.rel !== false
      }
    };
  },
  formValuesToSettings(settings, values) {
    settings = deepAssign({}, settings, filterObject(values, fieldNames));

    if (settings.parameters.color === 'white') {
      delete settings.parameters.modestBranding;
    }

    return settings;
  }
};
