import {
  RHFDateCalendar,
  RHFDatePicker,
  RHFDateRangePicker,
  RHFMobileDateTimePicker,
} from './rhf-date-picker';
import { RHFPasswordField } from './rhf-password-field';
import { RHFAutoComplete, RHFMultiSelect, RHFSelect } from './rhf-select';
import { RHFMultiSwitch, RHFSwitch } from './rhf-switch';
import { RHFTextField } from './rhf-text-field';
import { RHFUpload, RHFUploadAvatar, RHFUploadBox } from './rhf-upload';

// ----------------------------------------------------------------------

export const Field = {
  Text: RHFTextField,
  Autocomplete: RHFAutoComplete,
  Textarea: RHFTextField,
  Password: RHFPasswordField,
  Select: RHFSelect,
  MultiSelect: RHFMultiSelect,
  UploadAvatar: RHFUploadAvatar,
  Upload: RHFUpload,
  UploadBox: RHFUploadBox,
  Switch: RHFSwitch,
  MultiSwitch: RHFMultiSwitch,
  DatePicker: RHFDatePicker,
  DateRange: RHFDateRangePicker,
  MobileDateTimePicker: RHFMobileDateTimePicker,
  DateCalendar: RHFDateCalendar,
};
