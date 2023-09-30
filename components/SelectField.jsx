import Label from "@/components/Label";
import Select from "@/components/Select";
import { useField } from "formik";

function SelectField({ label, placeholder, children, ...props }) {
  const [field, meta, helpers] = useField(props);

  return (
    <div>
      <Label htmlFor={props.name}>{label}</Label>
      <Select
        {...props}
        {...field}
        id={props.name}
        className={meta.touched && meta.error ? "border-red-500" : ""}
        label={label}
        placeholder={placeholder}
        onValueChange={(value) => helpers.setValue(value)}
      >
        {children}
      </Select>
      {meta.touched && meta.error ? (
        <div className="text-red-500">{meta.error}</div>
      ) : null}
    </div>
  );
}

export default SelectField;
