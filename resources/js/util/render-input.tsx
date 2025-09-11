import { Repeater } from '@/components/repeater';
import { cn } from '@/lib/utils';
import { AutocompleteInput, Input, RepeaterInput } from '@/types/input';
import { Autocomplete, TextField } from '@mui/material';

const renderInput = (input: Input, onChange: (value: string | Input[][]) => void, key: string) => {
    switch (input.renderType) {
        case 'autocomplete':
            return (
                <Autocomplete
                    key={key}
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
            return <TextField key={key} className={cn('w-full', input.className)} label={input.label} onChange={(e) => onChange(e.target.value)} />;
            break;
        case 'textfieldnumeric':
            return (
                <TextField key={key} className={cn('w-full', input.className)} type={'number'} label={input.label} onChange={(e) => onChange(e.target.value)} />
            );
            break;
        case 'repeater':
            return (
                <Repeater
                    key={key}
                    hideInitial={(input as RepeaterInput).hideInitial}
                    rowClassName={cn('w-full', (input as RepeaterInput).rowClassName)}
                    className={cn('w-full', input.className)}
                    renderInputs={(input as RepeaterInput).renderInputs}
                    onInputsChange={(nestedInputs) => {
                        onChange(nestedInputs);
                    }}
                    addButtonLabel={(input as RepeaterInput).addButtonLabel}
                />
            );
            break;
    }
};

export { renderInput };
