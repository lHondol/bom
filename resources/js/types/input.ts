type InputRenderType = 'autocomplete' | 'textfield' | 'textfieldnumeric' | 'repeater';
type InputType = 'static' | 'formula';

interface BaseInput {
    id?: string;
    label?: string;
    renderType?: InputRenderType;
    type?: InputType;
    value?: string | Input[][];
    className?: string;
}

interface AutocompleteInput extends BaseInput {
    options: string[];
}

interface RepeaterInput extends BaseInput {
    rowClassName: string;
    renderInputs: Input[];
    onChange: (rowIndex: number, inputIndex: number, value: string | Input[][]) => void;
    onInputsChange: (inputs: Input[][]) => void;
    hideInitial: boolean
}

type Input = AutocompleteInput | RepeaterInput;

export type { AutocompleteInput, Input, InputRenderType, InputType, RepeaterInput };
