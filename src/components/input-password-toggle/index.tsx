import React, { Fragment, useState, forwardRef } from "react";
import classnames from "classnames";
import { Eye, EyeOff } from "react-feather";
import {
  InputGroup,
  Input,
  InputGroupText,
  Label,
  InputProps,
} from "reactstrap";

interface InputPasswordToggleProps extends InputProps {
  label?: string;
  hideIcon?: React.ReactNode;
  showIcon?: React.ReactNode;
  visible?: boolean;
  className?: string;
  placeholder?: string;
  iconSize?: number;
  inputClassName?: string;
  error?: boolean;
  name?: string;
  htmlFor?: string;
}

const InputPasswordToggle = forwardRef<
  HTMLInputElement,
  InputPasswordToggleProps
>((props, ref) => {
  const {
    label,
    hideIcon,
    showIcon,
    visible = false,
    className,
    htmlFor,
    placeholder,
    iconSize,
    inputClassName,
    invalid,
    error,
    name,
    ...rest
  } = props;

  const [inputVisibility, setInputVisibility] = useState(visible);

  const renderIcon = () => {
    const size = iconSize ?? 14;
    return inputVisibility
      ? showIcon ?? <EyeOff size={size} />
      : hideIcon ?? <Eye size={size} />;
  };

  return (
    <Fragment>
      {label && (
        <Label className="form-label" for={htmlFor}>
          {label}
        </Label>
      )}
      <InputGroup
        className={classnames(className, {
          "is-invalid": invalid,
        })}
      >
        <Input
          innerRef={ref} // <-- This is key: use `innerRef` for Reactstrap Input
          name={name}
          invalid={invalid}
          type={!inputVisibility ? "password" : "text"}
          placeholder={placeholder ?? "············"}
          className={classnames(inputClassName, { error })}
          id={htmlFor}
          {...rest}
        />
        <InputGroupText
          className={classnames("cursor-pointer", { error })}
          onClick={() => setInputVisibility(!inputVisibility)}
        >
          {renderIcon()}
        </InputGroupText>
      </InputGroup>
    </Fragment>
  );
});

InputPasswordToggle.displayName = "InputPasswordToggle";

export default InputPasswordToggle;
