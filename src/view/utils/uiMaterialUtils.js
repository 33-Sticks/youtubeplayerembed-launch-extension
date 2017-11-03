import SelectField from 'material-ui/SelectField';
import { RadioButtonGroup } from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import ConfirmationNumber from 'material-ui/svg-icons/notification/confirmation-number';

const addDataElementToken = (value, dataElementToken) => `${ value || '' }${ dataElementToken }`;
const openDataElementSelector = (input) => () => window.extensionBridge.openDataElementSelector(
  dataElement => input.onChange(addDataElementToken(input.value, dataElement))
);

export const renderTextField = ({ input, label, hintText, supportDataElement, suffixLabel, meta: { touched, error }, ...custom }) => (
  <div>
    <TextField
      autoComplete="off"
      style={ { float: 'left' } }
      floatingLabelText={ label }
      hintText={ hintText }
      errorText={ touched && error }
      { ...input }
      { ...custom }
    />
    {
      suffixLabel ?
        <label
          style={ {
            float: 'left',
            padding: '46px 0 0 10px'
          } }
        >
          {suffixLabel}
        </label> : null
    }
    {
      supportDataElement ?
        <IconButton
          tooltip="Data Element"
          style={{
            float: 'left',
            margin: '30px 0 0'
          }}
          onClick={ openDataElementSelector(input) }
        >
          <ConfirmationNumber />
        </IconButton> : null
    }
    <div style={ {clear: 'both'} }>&nbsp;</div>
  </div>

);

export const renderRadioGroup = ({ input, ...rest }) => (
  <RadioButtonGroup
    { ...input }
    { ...rest }
    valueSelected={ input.value }
    onChange={(event, value) => input.onChange(value)}
  />
);

export const renderSelectField = ({ input, label, meta: { touched, error }, children, ...custom }) => (
  <SelectField
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    children={children}
    {...custom}/>
);

export const renderCheckbox = ({ input, label }) => (
  <Checkbox
    label={label}
    checked={input.value ? true : false}
    onCheck={input.onChange}
  />
);
