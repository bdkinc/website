import Input from "@/components/Input";
import Label from "@/components/Label";
import { cn } from "@/components/utils";
import { useField } from "formik";

function TextField({ label, className, ...props }) {
  const [field, meta] = useField(props);

  return (
    <div>
      <Label htmlFor={props.name}>{label}</Label>
      <Input
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

export default TextField;
