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
}

function Repeater({ hideInitial = false, renderInputs, onInputsChange, className, rowClassName }: PropsWithChildren<RepeaterProps>) {
    const initializeInput = (input: Input, rowIndex: number): Input => {
        if (input.renderType === 'repeater') {
            const repeaterInput = input as RepeaterInput;
            return {
                ...repeaterInput,
                id: `${repeaterInput.label?.replace(' ', '').toLowerCase()}_${rowIndex}`,
                // initialize nested repeater rows
                value: repeaterInput.value || [repeaterInput.renderInputs.map((subInput, subIndex) => initializeInput(subInput, subIndex))],
            };
        }
        return {
            ...input,
            id: `${input.label?.replace(' ', '').toLowerCase()}_${rowIndex}`,
            value: input.value || '',
        };
    };

    const [inputs, setInputs] = useState<Input[][]>(() => {
        if (!hideInitial) return [renderInputs.map((input, i) => initializeInput(input, i))];
        return [];
    });

    const handleAddRow = () => {
        const newRow = renderInputs.map((input) => ({
            ...input,
            id: `${input.label?.toLowerCase()}_${inputs.length}`,
            value: '',
        }));
        setInputs((prev) => [...prev, newRow]);
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
        <div className={cn(className)}>
            {inputs.map((row, rowIndex) => (
                <div className={cn('w-full', rowClassName)} key={`row-${rowIndex}`}>
                    {row.map((input, inputIndex) => renderInput(input, (val) => handleInputChange(rowIndex, inputIndex, val)))}
                </div>
            ))}

            <Button variant="contained" onClick={handleAddRow}>
                Add Row
            </Button>
        </div>
    );
}

export { Repeater };
