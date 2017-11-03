import React from 'react';
import { Field } from 'redux-form';
import { deepAssign, filterObject } from '../../../utils/formConfigUtils';
import { isNumber, isSingleDataElementToken } from '../../../utils/validators';
import { renderTextField } from '../../../utils/uiMaterialUtils';

export default () => (
  <div>
    <Field
      label="Start playing the video at"
      name="parameters.start"
      suffixLabel="seconds from the start of the video"
      component={ renderTextField }
      supportDataElement
    />
    <Field
      label="Stop playing the video at"
      name="parameters.end"
      suffixLabel="seconds from the start of the video"
      component={ renderTextField }
      supportDataElement
    />
  </div>
);

const fields = [
  'parameters.start',
  'parameters.end'
];

export const formConfig = {
  settingsToFormValues(values, settings) {
    return deepAssign({}, values, filterObject(settings, fields));
  },
  formValuesToSettings(settings, values) {
    settings = deepAssign({}, settings, filterObject(values, fields));
    const parameters = settings.parameters || {};

    return {
      ...settings,
      parameters: {
        ...parameters,
        start: isNumber(parameters.start) ? Number(parameters.start) : parameters.start,
        end: isNumber(parameters.end) ? Number(parameters.end) : parameters.end
      }
    };
  },
  validate(errors, values) {
    const {
      start,
      end
    } = values.parameters || {};

    const videoTimingsErrors = {};

    const componentsWithErrors = errors.componentsWithErrors ?
      errors.componentsWithErrors.slice() : [];

    if (start &&
      (!isNumber(start) || start < 0) &&
      !isSingleDataElementToken(start)
    ) {
      videoTimingsErrors.start =
        'Please provide a number higher than 0 or a data element';
    }

    if (end &&
      (!isNumber(end) || end < 0) &&
      !isSingleDataElementToken(end)
    ) {
      videoTimingsErrors.end =
        'Please provide a number higher than 0 or a data element';
    }

    if (Object.keys(videoTimingsErrors).length) {
      componentsWithErrors.push('videoTimingsExpanded');

      errors = {
        ...errors,
        parameters: {
          ...errors.parameters,
          ...videoTimingsErrors
        }
      };
    }

    return {
      ...errors,
      componentsWithErrors
    };
  }
};
