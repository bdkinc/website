import Label from "@/components/Label";
import Textarea from "@/components/Textarea";
import { cn } from "@/components/utils";
import { useField } from "formik";

function TextAreaField({ label, className, ...props }) {
  const [field, meta, helpers] = useField(props);

  return (
    <div>
      <Label htmlFor={props.name}>{label}</Label>
      <Textarea
        id={props.name}
        {...props}
        {...field}
        className={cn(
          meta.touched && meta.error ? "border-red-500" : "",
          className,
        )}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500">{meta.error}</div>
      ) : null}
    </div>
  );
}

export default TextAreaField;
