import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./index.module.scss";
import { Option } from "../../types";
import { Input } from "../Input/index";
import classNames from "classnames";
import ChevronDownIcon from "../../icons/ChevronIcon";

export interface SelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  invalid?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  className,
  placeholder,
  invalid,
}) => {
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const [selectedOptionValue, setSelectedOptionValue] = useState(value || null);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!ref.current?.contains(event.target)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedOptionValue(value);
    }
  }, [value]);

  const openSelect = useCallback(() => {
    setIsSelectOpen(true);
  }, []);

  const onSelectItem = useCallback(
    (e: any) => {
      onChange?.(e.target.dataset.itemValue);
      setSelectedOptionValue(e.target.dataset.itemValue);
      setIsSelectOpen(false);
    },
    [onChange],
  );

  const selectedOptionLabel = useMemo(() => {
    const selectedOption = options.find((el) => {
      return el.value === selectedOptionValue;
    });

    return selectedOption?.label || "";
  }, [options, selectedOptionValue]);

  const getListItemClasses = useCallback(
    (value: string) => {
      return classNames(styles.selectListItem, {
        [styles["selectListItem--isChosen"]]: selectedOptionValue === value,
      });
    },
    [selectedOptionValue],
  );

  const wrapperClasses = classNames(
    styles.componentWrapper,
    {
      [styles["componentWrapper--selectOpen"]]: isSelectOpen,
      [styles["componentWrapper--selectClose"]]: !isSelectOpen,
    },
    className,
  );

  return (
    <div className={wrapperClasses} ref={ref}>
      <Input
        className={styles.inputWrapper}
        placeholder={placeholder}
        onFocus={openSelect}
        value={selectedOptionLabel}
        readOnly
        invalid={invalid}
        icon={<ChevronDownIcon />}
      />
      {isSelectOpen ? (
        <ul className={styles.optionsList}>
          {options.map((el) => (
            <li
              className={getListItemClasses(el.value)}
              data-item-value={el.value}
              key={el.value}
              onClick={onSelectItem}
            >
              {el.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
