import React from 'react';
import { Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { RadioButton } from 'material-ui/RadioButton';
import { renderTextField, renderRadioGroup } from '../../utils/uiMaterialUtils';

const PlayerSelect = ({ ...props }) => {
  const { playerSpecificity } = props;

  return (
    <div>
      <div>
        <Field
          name="playerSpecificity"
          component={ renderRadioGroup }
        >
          <RadioButton
            value="any"
            label="any player"
          />
          <RadioButton
            className="u-gapTop"
            value="specific"
            label="specific player"
          />
        </Field>
      </div>
      {
        playerSpecificity === 'specific' ?
          <Field
            floatingLabelText="Player ID"
            name="playerId"
            component={ renderTextField }
            className="u-gapLeft"
            supportDataElement
          /> : null
      }
    </div>
  );
};

const valueSelector = formValueSelector('default');
const stateToProps = state => ({
  playerSpecificity: valueSelector(state, 'playerSpecificity')
});

export default connect(stateToProps)(PlayerSelect);

export const formConfig = {
  settingsToFormValues: (values, settings, meta) => {
    const { playerId } = settings;

    return {
      ...values,
      playerId,
      playerSpecificity: meta.isNew || !playerId ? 'any' : 'specific'
    };
  },
  formValuesToSettings: (settings, values) => {
    settings = {
      ...settings,
      ...values
    };

    const { playerSpecificity } = values;

    if (playerSpecificity === 'any') {
      delete settings.playerId;
    }

    delete settings.playerSpecificity;

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (values.playerSpecificity !== 'any' && !values.playerId) {
      errors.playerId = 'Please provide a player ID';
    }

    return errors;
  }
};
