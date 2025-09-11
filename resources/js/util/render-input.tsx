import { Repeater } from '@/components/repeater';
import { cn } from '@/lib/utils';
import { AutocompleteInput, Input, RepeaterInput } from '@/types/input';
import { Autocomplete, TextField } from '@mui/material';

const renderInput = (input: Input, onChange: (value: string | Input[][]) => void) => {
    switch (input.renderType) {
        case 'autocomplete':
            return (
                <Autocomplete
                    className={cn('w-full', input.className)}
                    options={(input as AutocompleteInput).options}
                    renderInput={(params) => <TextField {...params} label={input.label} />}
                    onChange={(e, newValue) => {
                        onChange(newValue || '');
                    }}
                />
            );
            break;
        case 'textfield':
            return <TextField className={cn('w-full', input.className)} label={input.label} onChange={(e) => onChange(e.target.value)} />;
            break;
        case 'textfieldnumeric':
            return (
                <TextField className={cn('w-full', input.className)} type={'number'} label={input.label} onChange={(e) => onChange(e.target.value)} />
            );
            break;
        case 'repeater':
            return (
                <Repeater
                    hideInitial={(input as RepeaterInput).hideInitial}
                    className={cn('w-full', input.className)}
                    renderInputs={(input as RepeaterInput).renderInputs}
                    onInputsChange={(nestedInputs) => {
                        onChange(nestedInputs);
                    }}
                />
            );
            break;
    }
};

export { renderInput };
