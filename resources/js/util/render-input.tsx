import { Repeater } from '@/components/repeater';
import { cn } from '@/lib/utils';
import { AutocompleteInput, FormulaTextFieldInput, Input, RepeaterInput } from '@/types/input';
import { Autocomplete, TextField } from '@mui/material';

const renderInput = (
    input: Input,
    onChange: (value: string | Input[][]) => void,
    key: string,
    inputRefs?: React.RefObject<Record<string, HTMLInputElement | null>>,
    disableMap?: Record<string, boolean>,
) => {
    switch (input.renderType) {
        case 'autocomplete': {
            const autoCompleteInput = input as AutocompleteInput;
            return (
                <Autocomplete
                    key={key}
                    className={cn('w-full', autoCompleteInput.className)}
                    options={autoCompleteInput.options}
                    renderInput={(params) => <TextField {...params} label={autoCompleteInput.label} />}
                    value={autoCompleteInput.value}
                    onChange={(e, newValue) => {
                        onChange(newValue || '');
                    }}
                />
            );
            break;
        }
        case 'formulatextfield': {
            const formulaTextFieldInput = input as FormulaTextFieldInput;
            return (
                <TextField
                    key={key}
                    inputRef={(el) => {
                        if (inputRefs && formulaTextFieldInput.id) inputRefs.current[formulaTextFieldInput.id] = el;
                    }}
                    onFocus={() => formulaTextFieldInput.onFocus(formulaTextFieldInput.id as string)}
                    disabled={disableMap ? disableMap[formulaTextFieldInput.id!] : false}
                    className={cn('w-full', formulaTextFieldInput.className)}
                    label={formulaTextFieldInput.label}
                    value={formulaTextFieldInput.value}
                    onChange={(e) => onChange(e.target.value)}
                />
            );
            break;
        }
        case 'textfieldnumeric':
            return (
                <TextField
                    key={key}
                    className={cn('w-full', input.className)}
                    type={'number'}
                    label={input.label}
                    value={input.value}
                    onChange={(e) => onChange(e.target.value)}
                />
            );
            break;
        case 'repeater': {
            const repeaterInput = input as RepeaterInput;
            return (
                <Repeater
                    key={key}
                    label={repeaterInput.label}
                    parentPrefix={repeaterInput.id}
                    hideInitial={repeaterInput.hideInitial}
                    rowClassName={cn('w-full', repeaterInput.rowClassName)}
                    className={cn('w-full', input.className)}
                    renderInputs={repeaterInput.renderInputs}
                    onChange={(inputs) => {
                        onChange(inputs);
                    }}
                    addButtonLabel={repeaterInput.addButtonLabel}
                    value={input.value as Input[][]}
                />
            );
            break;
        }
    }
};

export { renderInput };
