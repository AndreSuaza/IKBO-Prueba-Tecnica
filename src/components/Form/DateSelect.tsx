
import { useField } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  name: string;
  placeholder?: string;
  [x:string]: any;
}

export const DateSelect = ({ ...props } : Props) => {

  const [ field, meta, helpers] = useField(props);
  const { value } = meta;
  const { setValue } = helpers;

  return (
    <div>
    { props.label && <label htmlFor={ props.id || props.name }>{ props.label }</label>}
    <DatePicker
      {...field}
      dateFormat={props.dateFormat}
      selected={value}
      onChange={setValue}
    />
    
    </div>
  );
};
