import React, {
  ReactNode,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
} from "react";
import cn from "classnames";
import styles from "./index.module.scss";
import { InputType } from "../../types";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  disabled?: boolean;
  invalid?: boolean;
  clearable?: boolean;
  width?: string;
  icon?: ReactNode;
  type?: InputType;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      disabled,
      invalid,
      className,
      type = InputType.Text,
      clearable,
      width = "100%",
      onClear,
      icon,
      ...props
    },
    outerRef,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const ref = useMemo<React.RefObject<HTMLInputElement>>(
      () => (outerRef as React.RefObject<HTMLInputElement>) || inputRef,
      [outerRef, inputRef],
    );

    const inputClasses = useMemo(
      () =>
        cn(styles.Input, {
          [styles["Input--disabled"]]: disabled,
          [styles["Input--invalid"]]: invalid,

          [styles["Input--clearable"]]: Boolean(clearable),
        }),
      [disabled, invalid, clearable],
    );

    const onIconClick = useCallback(
      (e: any) => {
        e.stopPropagation();
        ref.current?.focus();
      },
      [ref],
    );

    return (
      <div className={cn(styles.InputWrapper, className)} style={{ width }}>
        <input
          {...props}
          className={inputClasses}
          disabled={disabled}
          type={type}
          style={{ width }}
          ref={ref}
        />
        <div className={styles.icon} onClick={onIconClick}>
          {icon ? icon : null}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";
