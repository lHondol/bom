import React from 'react';

type InputRenderType = 'autocomplete' | 'formulatextfield' | 'textfieldnumeric' | 'repeater';
type InputType = 'static' | 'formula';

interface BaseInput {
    id?: string;
    label?: string;
    renderType?: InputRenderType;
    value?: string | Input[][];
    className?: string;
}

interface AutocompleteInput extends BaseInput {
    options: string[];
}

interface FormulaTextFieldInput extends BaseInput {
    type?: InputType;
    computedValue?: string;
    onFocus: (id: string) => void;
    disabled?: boolean
}

interface RepeaterInput extends BaseInput {
    rowClassName: string;
    renderInputs: Input[];
    onChange?: (inputs: Input[][]) => void;
    hideInitial?: boolean;
    addButtonLabel: string;
    parentPrefix?: string;
    inputRefs?: React.RefObject<Record<string, HTMLInputElement | null>>;
    disableMap?: Record<string, boolean>
}

type Input = AutocompleteInput | FormulaTextFieldInput | RepeaterInput;

export type { AutocompleteInput, FormulaTextFieldInput, Input, InputRenderType, InputType, RepeaterInput };
