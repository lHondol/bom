import { cn } from '@/lib/utils';
import { Input, RepeaterInput } from '@/types/input';
import { renderInput } from '@/util/render-input';
import { Button } from '@mui/material';
import React, { memo, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type RepeaterProps = RepeaterInput;

interface RowProps {
    row: Input[];
    rowIndex: number;
    rowClassName?: string;
    onChange: (rowIndex: number, inputIndex: number, value: string | Input[][]) => void;
    inputRefs?: React.RefObject<Record<string, HTMLInputElement | null>>;
}

const InputRenderer = memo(
    ({
        input,
        onChange,
        inputRefs,
    }: {
        input: Input;
        onChange: (value: string | Input[][]) => void;
        inputRefs?: React.RefObject<Record<string, HTMLInputElement | null>>;
    }) => renderInput(input, onChange, input.id as string, inputRefs),
    (prev, next) => prev.input.value === next.input.value,
);

const Row = memo(
    ({ row, rowIndex, rowClassName, onChange, inputRefs }: RowProps) => (
        <div className={rowClassName}>
            {row.map((input, inputIndex) => (
                <InputRenderer key={input.id} input={input} onChange={(val) => onChange(rowIndex, inputIndex, val)} inputRefs={inputRefs} />
            ))}
        </div>
    ),
    (prev, next) => prev.row === next.row,
);
Row.displayName = 'Row';

function Repeater({
    label,
    parentPrefix = '',
    hideInitial = false,
    renderInputs,
    onChange,
    className,
    rowClassName,
    addButtonLabel,
    value,
    inputRefs,
}: PropsWithChildren<RepeaterProps>) {
    const [localRows, setLocalRows] = useState<Input[][]>((value as Input[][]) ?? []);

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

    // Initialize first row if hideInitial is false
    useEffect(() => {
        if (!hideInitial && localRows.length === 0) {
            const initialRow = renderInputs.map((input) => initializeInput(input, 0, parentPrefix));
            setLocalRows([initialRow]);
            onChange?.([initialRow]);
        }
    }, []);

    useEffect(() => {
        setLocalRows((prev) => {
            // simple check to avoid unnecessary updates
            if (JSON.stringify(prev) !== JSON.stringify(value)) {
                return value as Input[][];
            }
            return prev;
        });
    }, [value]);

    const debouncedSync = useDebouncedCallback((rows: Input[][]) => {
        onChange?.(rows);
    }, 300);

    const handleInputChange = useCallback(
        (rowIndex: number, inputIndex: number, newVal: string | Input[][]) => {
            setLocalRows((prev) => {
                const updated = [...prev];
                const row = updated[rowIndex];
                const input = row[inputIndex];

                if (input.value === newVal) return prev;

                const newRow = [...row];
                newRow[inputIndex] = { ...input, value: newVal };
                updated[rowIndex] = newRow;

                debouncedSync(updated);
                return updated;
            });
        },
        [debouncedSync],
    );

    const handleAddRow = useCallback(() => {
        const newRow = renderInputs.map((input) => initializeInput(input, localRows.length, parentPrefix));
        setLocalRows((prev) => {
            const updated = [...prev, newRow];
            onChange?.(updated);
            return updated;
        });
    }, [localRows, renderInputs, initializeInput, parentPrefix, onChange]);

    return (
        <div className={cn('space-y-3', className)}>
            {localRows.map((row, rowIndex) => (
                <Row
                    key={`row-${rowIndex}`}
                    row={row}
                    rowIndex={rowIndex}
                    rowClassName={rowClassName}
                    onChange={handleInputChange}
                    inputRefs={inputRefs}
                />
            ))}
            <Button variant="contained" onClick={handleAddRow}>
                {addButtonLabel ?? 'Add Row'}
            </Button>
        </div>
    );
}

export { Repeater };
