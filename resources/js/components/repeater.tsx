import { cn } from '@/lib/utils';
import { Input, RepeaterInput } from '@/types/input';
import { renderInput } from '@/util/render-input';
import { Button } from '@mui/material';
import { PropsWithChildren, useEffect, useState } from 'react';

interface RepeaterProps {
    hideInitial?: boolean;
    renderInputs: Input[];
    onInputsChange?: (inputs: Input[][]) => void;
    className?: string;
    rowClassName?: string;
    addButtonLabel?: string;
}

function Repeater({ hideInitial = false, renderInputs, onInputsChange, className, rowClassName, addButtonLabel }: PropsWithChildren<RepeaterProps>) {
    const [inputs, setInputs] = useState<Input[][]>([]);

    const initializeInput = (input: Input, index: number): Input => {
        if (input.renderType === 'repeater') {
            const repeaterInput = input as RepeaterInput;
            if (!repeaterInput.hideInitial) {
                return {
                    ...repeaterInput,
                    id: `${repeaterInput.label?.replace(' ', '').toLowerCase()}_${index}`,
                    // initialize nested repeater rows
                    value: repeaterInput.value || [repeaterInput.renderInputs.map((subInput) => initializeInput(subInput, index))],
                };
            }
        }
        return {
            ...input,
            id: `${input.label?.replace(' ', '').toLowerCase()}_${index}`,
            value: input.value || '',
        };
    };

    useEffect(() => {
        if (!hideInitial) {
            setInputs([renderInputs.map((input, i) => initializeInput(input, inputs.length))]);
        } else {
            setInputs([]);
        }
    }, [renderInputs, hideInitial]);

    const handleAddRow = () => {
        const newRow = renderInputs.map((input) => ({
            ...input,
            id: `${input.label?.replace(' ', '').toLowerCase()}_${inputs.length}`,
            value: '',
        }));
        setInputs((prev) => {
            const updated = [...prev, newRow];
            onInputsChange?.(updated);
            return updated;
        });
    };

    const handleInputChange = (rowIndex: number, inputIndex: number, value: string | Input[][]) => {
        setInputs((prev) => {
            const newRows = [...prev];
            newRows[rowIndex][inputIndex].value = value;
            return newRows;
        });

        if (onInputsChange) {
            onInputsChange(inputs);
        }
    };

    return (
        <div className={cn("space-y-3", className)}>
            {inputs.map((row, rowIndex) => (
                <div className={cn('w-full', rowClassName)} key={`row-${rowIndex}`}>
                    {row.map((input, inputIndex) =>
                        renderInput(input, (val) => handleInputChange(rowIndex, inputIndex, val), `${rowIndex}-${inputIndex}-${input.id}`)
                    )}
                </div>
            ))}

            <Button variant="contained" onClick={handleAddRow}>
                {addButtonLabel ?? 'Add Row'}
            </Button>
        </div>
    );
}

export { Repeater };
