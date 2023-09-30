import Checkbox from "@/components/Checkbox";
import Label from "@/components/Label";
import { useField } from "formik";
import { Children, cloneElement, useState } from "react";

function CheckboxField({ items, label, className, children, ...props }) {
  const [field, meta, helpers] = useField(props);
  const [values, setValues] = useState(
    field.value && field.value.length
      ? field.value.reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
      : {},
  );

  return (
    <div className={className}>
      <Label className="block w-full">{label}</Label>
      {items
        ? items.map((item) => (
            <Checkbox.Option
              key={item.value}
              {...field}
              {...props}
              value={item.value}
              onCheckedChange={(isChecked) => {
                const newValue = { ...values, [item.value]: isChecked };
                setValues(newValue);
                helpers.setValue(
                  Object.keys(newValue).filter((key) => newValue[key]),
                );
              }}
            >
              {item.label}
            </Checkbox.Option>
          ))
        : Children.map(children, (child) =>
            cloneElement(child, {
              ...field,
              ...props,
              onCheckedChange(isChecked) {
                const newValue = { ...values, [child.props.value]: isChecked };
                setValues(newValue);
                helpers.setValue(
                  Object.keys(newValue).filter((key) => newValue[key]),
                );
              },
            }),
          )}
      {meta.touched && meta.error ? (
        <div className="text-red-500">{meta.error}</div>
      ) : null}
    </div>
  );
}

export default CheckboxField;
