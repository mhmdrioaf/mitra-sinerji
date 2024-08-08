import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { InputModeOptions } from "react-native";
import CurrencyInput from "react-native-currency-input";
import { Text, TextInput, useTheme } from "react-native-paper";
import { ThemeProp } from "react-native-paper/lib/typescript/types";

interface FormInputControllerProps<FieldsType extends FieldValues> {
  name: Path<FieldsType>;
  defaultValue?: string;
  rules?: RegisterOptions;
  error?: FieldError;
  control: Control<FieldsType>;
}

interface Props<FieldsType extends FieldValues>
  extends FormInputControllerProps<FieldsType> {
  label?: string;
  placeholder?: string;
  asNumber?: boolean;
  asCurrency?: boolean;
  disabled?: boolean;
  inputMode?: InputModeOptions;
  theme?: ThemeProp;
}

export default function FormInput<T extends FieldValues>({
  ...props
}: Props<T>) {
  const theme = useTheme();
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field, fieldState }) => (
        <>
          {props.asCurrency ? (
            <CurrencyInput
              value={field?.value}
              onBlur={field.onBlur}
              onChangeValue={field.onChange}
              prefix="Rp. "
              precision={0}
              delimiter="."
              minValue={0}
              renderTextInput={({
                selectionColor,
                cursorColor,
                ...textInputProps
              }) => (
                <TextInput
                  label={props.label}
                  mode="outlined"
                  {...textInputProps}
                />
              )}
            />
          ) : (
            <TextInput
              label={props.label}
              mode="outlined"
              inputMode={props.inputMode}
              onChangeText={(text) =>
                props.asNumber
                  ? field.onChange(Number(text))
                  : field.onChange(text)
              }
              value={field?.value}
              onBlur={field.onBlur}
              disabled={props.disabled}
              theme={props.theme}
            />
          )}

          {fieldState.error && (
            <Text style={{ color: theme.colors.error }}>
              {fieldState.error.message}
            </Text>
          )}
        </>
      )}
    />
  );
}
