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
    onInputsChange?: (inputs: Input[][]) => void;
    className?: string;
    rowClassName?: string;
    addButtonLabel?: string;
    value: Input[][];
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
    value,
}: PropsWithChildren<RepeaterProps>) {
    // Local state for instant updates
    const [localRows, setLocalRows] = useState<Input[][]>(value ?? []);

    const initializeInput = useCallback(
        (input: Input, index: number, prefix?: string): Input => {
            const currentPrefix = prefix ? `${prefix}_` : `${label?.replace(' ', '_')}_`;
            const currentId = `${currentPrefix}${index}_${input.label?.replace(' ', '_')}`;

            if (input.renderType === 'repeater') {
                const repeaterInput = input as RepeaterInput;
                return {
                    ...repeaterInput,
                    id: currentId,
                    value: !repeaterInput.hideInitial ? [repeaterInput.renderInputs.map((subInput) => initializeInput(subInput, 0, currentId))] : [],
                };
            }
            return {
                ...input,
                id: currentId,
                value: input.value || '',
            };
        },
        [renderInputs, label],
    );

    // Sync localRows with parent on first mount
    useEffect(() => {
        if (!hideInitial && (!localRows || localRows.length === 0)) {
            const initialRow = renderInputs.map((input, i) => initializeInput(input, 0, parentPrefix));
            setLocalRows([initialRow]);
            onInputsChange?.([initialRow]);
        }
    }, []);

    // Debounced parent sync
    const debouncedSync = useDebouncedCallback((rows: Input[][]) => {
        onInputsChange?.(rows);
    }, 300);

    // Input change handler
    const handleInputChange = useCallback(
        (rowIndex: number, inputIndex: number, newVal: string | Input[][]) => {
            setLocalRows((prev) => {
                const updated = prev.map((row, i) =>
                    i === rowIndex ? row.map((input, j) => (j === inputIndex ? { ...input, value: newVal } : input)) : row,
                );
                debouncedSync(updated);
                return updated;
            });
        },
        [debouncedSync],
    );

    // Add new row
    const handleAddRow = useCallback(() => {
        const newRow = renderInputs.map((input) => initializeInput(input, localRows.length, parentPrefix));
        setLocalRows((prev) => {
            const updated = [...prev, newRow];
            onInputsChange?.(updated); // Instant sync on add
            return updated;
        });
    }, [localRows, renderInputs, initializeInput, parentPrefix, onInputsChange]);

    return (
        <div className={cn('space-y-3', className)}>
            {localRows.map((row, rowIndex) => (
                <Row key={`row-${rowIndex}`} row={row} rowIndex={rowIndex} rowClassName={rowClassName} onChange={handleInputChange} />
            ))}
            <Button variant="contained" onClick={handleAddRow}>
                {addButtonLabel ?? 'Add Row'}
            </Button>
        </div>
    );
}

export { Repeater };
