import React from "react";
import Select, { components } from "react-select";
import { ErrorMessage, useField } from "formik";

interface Option {
  value: string | number;
  label: string;
  color?: string;
  image?: string;
}

interface Props {
  name: string;
  options: Option[];
  placeholder?: string;
  bgColor?: string;
  textColor?: string;
  menuBgColor?: string;
  optionSelectedBg?: string;
  optionHoverBg?: string;
  isMulti?: boolean;
  borderColor?: string;
  disabled?: boolean;
  isColor?: boolean;
  setSelectedId?: (id: number) => void;
}

const CustomOption = (props: any) => (
  <components.Option {...props}>
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {/* If image exists → show image */}
      {props.data.image && props.data.image.length > 0 && (
        <img
          src={props.data.image}
          alt={props.data.label}
          style={{ width: "24px", height: "24px", objectFit: "cover", borderRadius: "4px" }}
        />
      )}
      {/* If color exists → show swatch */}
      {props.data.color && !props.data.image && (
        <span
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "2px",
            backgroundColor: props.data.color,
            display: "inline-block",
          }}
        />
      )}

      <span>{props.data.label}</span>
    </div>
  </components.Option>
);


const CustomMultiValueLabel = (props: any) => (
  <components.MultiValueLabel {...props}>
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {props.data.image && (
        <img
          src={props.data.image}
          alt={props.data.label}
          style={{ width: "18px", height: "18px", objectFit: "cover", borderRadius: "3px" }}
        />
      )}
      {props.data.color && !props.data.image && (
        <span
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "2px",
            backgroundColor: props.data.color,
            display: "inline-block",
          }}
        />
      )}
      <span>{props.data.label}</span>
    </div>
  </components.MultiValueLabel>
);


const CheckboxOption = (props: any) => {
  const { data, isSelected, selectOption } = props;

  // If option is "#" → render without checkbox
  if (data.value === "#") {
    return (
      <components.Option {...props}>
        <span>{data.label}</span>
      </components.Option>
    );
  }

  return (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => null}
        className="mr-2"
      />
      <label>{props.label}</label>
    </components.Option>
  );
};


const customStyles = (
  error?: boolean,
  touched?: boolean,
  {
    bgColor = "#313A46",
    textColor = "#FFFFFF",
    borderColor = "#475569",
    menuBgColor = "#313A46",
    optionSelectedBg = "#475569",
    optionHoverBg = "#3f4a5a",
  }: {
    bgColor?: string;
    textColor?: string;
    borderColor?: string;
    menuBgColor?: string;
    optionSelectedBg?: string;
    optionHoverBg?: string;
  } = {}
) => ({
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: bgColor,
    borderColor: state.isFocused
      ? textColor
      : error && touched
        ? "#f87171"
        : borderColor,
    borderWidth: "1px",
    borderRadius: "0.5rem",
    color: textColor,
    padding: "2px",
    boxShadow: "none",
    "&:hover": {
      borderColor: textColor,
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: textColor,
  }),
  placeholder: (base: any) => ({
    ...base,
    color: textColor + "99",
  }),
  input: (base: any) => ({
    ...base,
    color: textColor,
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: menuBgColor,
    color: textColor,
    borderRadius: "0.5rem",
    overflow: "hidden",
    border: `1px solid ${borderColor}`,
  }),
  // ✅ Scrollbar styling here
  menuList: (base: any) => ({
    ...base,
    maxHeight: "200px",
    overflowY: "auto",
    "::-webkit-scrollbar": {
      width: "8px",
    },
    "::-webkit-scrollbar-thumb": {
      backgroundColor: textColor + "75",
      borderRadius: "4px",
    },
    "::-webkit-scrollbar-thumb:hover": {
      backgroundColor: textColor,
    },
    "::-webkit-scrollbar-track": {
      backgroundColor: menuBgColor,
    },
    scrollbarWidth: "thin",
    scrollbarColor: `${textColor} ${menuBgColor}`,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? optionSelectedBg
      : state.isFocused
        ? optionHoverBg
        : menuBgColor,
    color: textColor,
    cursor: "pointer",
    "&:active": {
      backgroundColor: optionSelectedBg,
    },
  }),

  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "transparent",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: textColor,
    backgroundColor: "transparent",
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: textColor,
    ":hover": {
      backgroundColor: "transparent",
      color: "#f87171",
    },
  }),
});


const SelectField: React.FC<Props> = ({
  name,
  options,
  placeholder,
  bgColor,
  textColor,
  menuBgColor,
  optionSelectedBg,
  optionHoverBg,
  isMulti = false,
  isColor = false,
  disabled,
  setSelectedId
}) => {
  const [field, meta, helpers] = useField(name);

  const selectedValue = isMulti
    ? options.filter((opt) => field.value?.includes(opt.value))
    : options.find((opt) => opt.value === field.value) || null;


  const selectComponents: any = {
    IndicatorSeparator: () => null,
    Option: CustomOption,
  };

  if (isMulti) {
    selectComponents.Option = CheckboxOption;
  }

  if (isColor) {
    selectComponents.Option = CustomOption;
    selectComponents.MultiValueLabel = CustomMultiValueLabel;
  }


  return (
    <div >
      <Select
        name={name}
        value={selectedValue}
        options={options}
        onChange={(option: any, actionMeta: any) => {
          if (isMulti) {
            const values = option.map((o: any) => o.value);

            // If "#" is selected → set only that and close
            if (values.includes("#")) {
              helpers.setValue(["#"]);
              document.activeElement && (document.activeElement as HTMLElement).blur(); // closes menu
            } else {
              helpers.setValue(values);
            }
          } else {
            helpers.setValue(option ? option.value : "");
          }
        }}
        onBlur={() => helpers.setTouched(true)}
        styles={customStyles(!!meta.error, meta.touched, {
          bgColor,
          textColor,
          menuBgColor,
          optionSelectedBg,
          optionHoverBg,
        })}
        components={selectComponents}
        placeholder={placeholder}
        isMulti={isMulti}
        isDisabled={disabled}
        closeMenuOnSelect={!isMulti}
        hideSelectedOptions={false}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-400 text-sm mt-1"
      />
    </div>
  );
};

export default SelectField;
