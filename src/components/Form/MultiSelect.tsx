import { useField, ErrorMessage, Field } from 'formik';
import CustomSelect from './CustomSelect';

interface Props {
    name: string;
    placeholder?: string;
    [x:string]: any;
}

export const MultiSelect = ( { ...props } : Props ) => {

    const [ field ] = useField(props);

  return (
    <div>
        { props.label && <label htmlFor={ props.id || props.name }>{ props.label }</label>}
        <Field {...field} {...props} component={CustomSelect}/>
        <ErrorMessage name={props.name} component="span"/>
    </div>
  )
}
