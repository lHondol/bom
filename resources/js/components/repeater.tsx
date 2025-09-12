import { cn } from '@/lib/utils';
import { Input, RepeaterInput } from '@/types/input';
import { renderInput } from '@/util/render-input';
import { Button } from '@mui/material';
import { memo, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface RepeaterProps {
    label?: string;
    parentPrefix?: string;
    hideInitial?: boolean;
    renderInputs: Input[];
    onInputsChange?: (identifier: string, inputs: Input[][]) => void;
    className?: string;
    rowClassName?: string;
    addButtonLabel?: string;
}

interface RowProps {
    row: Input[];
    rowIndex: number;
    rowClassName?: string;
    onChange: (rowIndex: number, inputIndex: number, value: string | Input[][]) => void;
}

const Row = memo(({ row, rowIndex, rowClassName, onChange }: RowProps) => {
    return (
        <div className={rowClassName} key={`row-${rowIndex}`}>
            {row.map((input, inputIndex) =>
                renderInput(input, (val) => onChange(rowIndex, inputIndex, val), `${rowIndex}-${inputIndex}-${input.id}`),
            )}
        </div>
    );
});

Row.displayName = 'Row';

function Repeater({
    label,
    parentPrefix = '',
    hideInitial = false,
    renderInputs,
    onInputsChange,
    className,
    rowClassName,
    addButtonLabel,
}: PropsWithChildren<RepeaterProps>) {
    const [inputs, setInputs] = useState<Input[][]>([]);

    const identifier = label?.replace(' ', '_').toLowerCase();

    const initializeInput = useCallback(
        (input: Input, index: number, prefix?: string): Input => {
            const currentPrefix = prefix ? `${prefix}_` : `${label?.replace(' ', '_')}_`;
            const currentId = `${currentPrefix}${index}_${input.label?.replace(' ', '_')}`;

            if (input.renderType === 'repeater') {
                const repeaterInput = input as RepeaterInput;
                return {
                    ...repeaterInput,
                    id: currentId,
                    // initialize nested repeater rows
                    value: !repeaterInput.hideInitial
                        ? [repeaterInput.renderInputs.map((subInput) => initializeInput(subInput, index, currentId))]
                        : [],
                };
            }
            return {
                ...input,
                id: currentId,
                value: input.value || '',
            };
        },
        [renderInputs],
    );

    useEffect(() => {
        setInputs((prev) => {
            if (!hideInitial && prev.length === 0) {
                return [renderInputs.map((input, i) => initializeInput(input, 0, parentPrefix))];
            }

            let hasChanged = false;

            const updated = prev.map((row) =>
                row.map((input, inputIndex) => {
                    const updatedDef = renderInputs[inputIndex];
                    if (!updatedDef) return input;

                    // Only create new object if something changed
                    const isSame =
                        input.label === updatedDef.label &&
                        input.renderType === updatedDef.renderType &&
                        (input.renderType !== 'autocomplete' ||
                            JSON.stringify((input as any).options) === JSON.stringify((updatedDef as any).options));

                    if (isSame) return input; // keep old reference

                    hasChanged = true;
                    return {
                        ...input,
                        ...updatedDef,
                        value: input.value,
                    };
                }),
            );

            return hasChanged ? updated : prev; // only set state if something changed
        });
    }, [renderInputs, hideInitial, initializeInput, parentPrefix]);

    const debouncedOnInputsChange = useDebouncedCallback(
        (updatedRows: Input[][]) => {
            onInputsChange?.(`repeater_${identifier}`, updatedRows);
        },
        300, // debounce 300ms (adjust as needed)
    );

    const handleAddRow = useCallback(() => {
        const newRow = renderInputs.map((input, i) => initializeInput(input, inputs.length, parentPrefix));
        setInputs((prev) => [...prev, newRow]);
    }, [inputs.length, renderInputs, initializeInput, parentPrefix]);

    const handleInputChange = useCallback(
        (rowIndex: number, inputIndex: number, value: string | Input[][]) => {
            setInputs((prev) => {
                const newRows = [...prev];
                newRows[rowIndex][inputIndex] = {
                    ...newRows[rowIndex][inputIndex],
                    value,
                };
                return newRows;
            });
        },
        [setInputs, debouncedOnInputsChange],
    );

    useEffect(() => {
        debouncedOnInputsChange(inputs);
    }, [inputs, debouncedOnInputsChange]);

    return (
        <div className={cn('space-y-3', className)}>
            {inputs.map((row, rowIndex) => (
                <Row key={`row-${rowIndex}`} row={row} rowIndex={rowIndex} rowClassName={rowClassName} onChange={handleInputChange} />
            ))}

            <Button variant="contained" onClick={handleAddRow}>
                {addButtonLabel ?? 'Add Row'}
            </Button>
        </div>
    );
}

export { Repeater };
