import React from 'react';
import { Field } from 'redux-form';
import { isPositiveNumber } from '../../utils/validators';
import PlayersSelect, { formConfig as playerSelectFormConfig } from '../components/playersSelect';
import { mergeConfigs } from '../../utils/formConfigUtils';
import { renderSelectField, renderTextField } from '../../utils/uiMaterialUtils';
import MenuItem from 'material-ui/MenuItem';

const timePlayedUnit = {
  SECOND: 'second',
  PERCENT: 'percent'
};

export default () => (
  <div>
    <PlayersSelect />
    <div className="u-gapTop">
      <div className="Label u-gapRight">
        Trigger after
      </div>
      <Field
        floatingLabelText="Amount"
        name="amount"
        component={ renderTextField }
      />
      <Field
        name="unit"
        label="Unit"
        className="u-gapLeft TimePlayed-unitSelect"
        component={ renderSelectField }
      >
        <MenuItem value={ timePlayedUnit.SECOND } primaryText="seconds" />
        <MenuItem value={ timePlayedUnit.PERCENT } primaryText="%" />
      </Field>
    </div>
  </div>
);

export const formConfig = mergeConfigs(
  playerSelectFormConfig,
  {
    settingsToFormValues: (values, settings) => ({
      ...values,
      ...settings,
      unit: settings.unit || timePlayedUnit.SECOND
    }),
    formValuesToSettings: (settings, values) => ({
      ...settings,
      unit: values.unit,
      amount: Number(values.amount)
    }),
    validate: (errors, values) => {
      errors = {
        ...errors
      };

      if (!isPositiveNumber(values.amount)) {
        errors.amount = 'Please specify a positive number';
      }

      return errors;
    }
  }
);
