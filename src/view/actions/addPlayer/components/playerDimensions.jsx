import React from 'react';
import { Field } from 'redux-form';
import { deepAssign, filterObject } from '../../../utils/formConfigUtils';
import { isNumber, isSingleDataElementToken } from '../../../utils/validators';
import { renderTextField } from '../../../utils/uiMaterialUtils';

export default () => (
  <div>
    <Field
      label="Width"
      name="dimensions.width"
      component={ renderTextField }
      hintText="640"
      suffixLabel="px"
      supportDataElement
    />
    <Field
      label="Height"
      name="dimensions.height"
      component={ renderTextField }
      hintText="360"
      suffixLabel="px"
      supportDataElement
    />
  </div>
);

const fields = [
  'dimensions.width',
  'dimensions.height'
];

export const formConfig = {
  settingsToFormValues(values, settings) {
    return deepAssign({}, values, filterObject(settings, fields));
  },
  formValuesToSettings(settings, values) {
    return deepAssign({}, settings, filterObject(values, fields));
  },
  validate(errors, values) {
    const {
      width,
      height
    } = values.dimensions || {};

    const playerDimensionsErrors = {};

    const componentsWithErrors = errors.componentsWithErrors ?
      errors.componentsWithErrors.slice() : [];

    if (width &&
      (!isNumber(width) || width < 200) &&
      !isSingleDataElementToken(width)
    ) {
      playerDimensionsErrors.width =
        'Please provide a number that is at least 200 pixels or a data element';
    }

    if (height &&
      (!isNumber(height) || height < 200) &&
      !isSingleDataElementToken(height)
    ) {
      playerDimensionsErrors.height =
        'Please provide a number that is at least 200 pixels or a data element';
    }

    if (Object.keys(playerDimensionsErrors).length) {
      componentsWithErrors.push('videoDetailsExpanded');

      errors = {
        ...errors,
        dimensions: playerDimensionsErrors
      };
    }

    return {
      ...errors,
      componentsWithErrors
    };
  }
};
