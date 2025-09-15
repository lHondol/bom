import { Repeater } from '@/components/repeater';
import { cn } from '@/lib/utils';
import { AutocompleteInput, FormulaTextFieldInput, Input, RepeaterInput } from '@/types/input';
import { Paper, Typography } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';

export default function BomRecord() {
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const focusedRef = useRef<HTMLInputElement | null>(null);
    const focusedFieldIdRef = useRef<string>('');

    const [formState, setFormState] = useState<{
        components: Input[][];
        supportingMaterials: Input[][];
    }>({
        components: [],
        supportingMaterials: [],
    });

    const inputMapRef = useRef<Record<string, Input>>({});

    const flattenInputs = useCallback((inputs: Input[][]) => {
        const recursive = (rows: Input[][]) => {
            rows.forEach((row) =>
                row.forEach((input) => {
                    if (!input) return;
                    inputMapRef.current[input.id as string] = input;
                    if (input.renderType === 'repeater') {
                        const nestedRows = input.value as Input[][];
                        recursive(nestedRows);
                    }
                }),
            );
        };
        recursive(inputs);
    }, []);

    const computeValue = useCallback((formula?: string): string => {
        if (!formula) return '';

        try {
            const clean = formula.replace(/^=/, '');

            // Match variables, numbers, operators, and parentheses
            const tokens = clean.match(/[A-Za-z_]\w*|\d+|[+\-*/()]/g) || [];

            const newTokens = tokens.map((token) => {
                if (!/^[+\-*/()]$/.test(token)) {
                    if (!isNaN(parseFloat(token))) return token;
                    return inputMapRef.current[token]?.value;
                }
                return token;
            });

            return eval(newTokens.join(''));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            return 'NaN';
        }
    }, []);

    const updateInputs = (inputId: string, focusedValue?: string, asFormula: boolean = false) => {
        const updateRows = (rows: Input[][]): Input[][] =>
            rows.map((row) =>
                row.map((i) => {
                    if (i.id === inputId && i.renderType == 'formulatextfield')
                        return {
                            ...i,
                            value: !asFormula ? computeValue(focusedValue) : focusedValue,
                            formula: focusedValue?.includes('=') ? focusedValue : '',
                        };
                    if (i.renderType === 'repeater') {
                        return { ...i, value: updateRows(i.value as Input[][]) };
                    }
                    return i;
                }),
            );

        setFormState((prev) => {
            const newState = {
                components: updateRows(prev.components),
                supportingMaterials: updateRows(prev.supportingMaterials),
            };
            flattenInputs(newState.components);
            flattenInputs(newState.supportingMaterials);
            return newState;
        });
    };

    // Focus / blur handlers
    const handleFocus = useCallback((el: HTMLInputElement, inputId: string) => {
        focusedRef.current = el;
        focusedFieldIdRef.current = inputId;

        updateInputs(inputId, (inputMapRef.current[inputId] as FormulaTextFieldInput).formula, true);
    }, []);

    const handleBlur = useCallback((el: HTMLInputElement, inputId: string) => {
        const focusedValue = focusedRef.current?.value;

        updateInputs(inputId, focusedValue);

        focusedRef.current = null;
        focusedFieldIdRef.current = '';
    }, []);

    const handleInputMouseDown = useCallback(
        (e: React.MouseEvent<HTMLInputElement>, el: HTMLInputElement, inputId: string) => {
            if (focusedRef.current && focusedRef.current !== el) {
                e.preventDefault(); // prevent focus from changing
                focusedRef.current.focus(); // keep current input focused

                const clickedId = inputMapRef.current[inputId]?.id;
                const focusedValue = focusedRef.current.value;
                const focusedId = focusedFieldIdRef.current;
                if (!clickedId || !focusedId) return;

                if (focusedValue?.startsWith('=') && focusedValue?.includes('=')) {
                    const caretIndex = focusedRef.current.selectionStart;
                    // Inputted outside clickedField will be not replaced
                    const newFocusedValue = focusedValue.slice(0, caretIndex as number) + clickedId + focusedValue.slice(caretIndex as number);
                    focusedRef.current.value = newFocusedValue;

                    focusedRef.current.selectionStart = (caretIndex as number) + clickedId.length;
                    focusedRef.current.selectionEnd = (caretIndex as number) + clickedId.length;
                }
            }
        },
        [formState],
    );

    const subComponentRenders: Input[] = [
        {
            label: 'Sub Component',
            renderType: 'autocomplete',
            type: 'static',
            className: 'flex-2',
            options: ['Lipping', 'Veneer', 'Core'],
        } as AutocompleteInput,
        {
            label: 'Quantity',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'flex-1',
            onFocus: handleFocus,
            onBlur: handleBlur,
            onMouseDown: handleInputMouseDown,
        } as Input,
        {
            label: 'Depth',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'flex-1',
            onFocus: handleFocus,
            onBlur: handleBlur,
            onMouseDown: handleInputMouseDown,
        } as Input,
        {
            label: 'Width',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'flex-1',
            onFocus: handleFocus,
            onBlur: handleBlur,
            onMouseDown: handleInputMouseDown,
        } as Input,
        {
            label: 'Length',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'flex-1',
            onFocus: handleFocus,
            onBlur: handleBlur,
            onMouseDown: handleInputMouseDown,
        } as Input,
    ];

    const componentRenders: Input[] = [
        {
            label: 'Component',
            renderType: 'autocomplete',
            type: 'static',
            className: 'flex-2',
            options: ['Tiang Samping', 'Ambang Atas', 'Ambang Bawah'],
        } as AutocompleteInput,
        {
            label: 'Quantity',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'flex-1',
            onFocus: handleFocus,
            onBlur: handleBlur,
            onMouseDown: handleInputMouseDown,
        } as Input,
        {
            label: 'Depth',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'flex-1',
            onFocus: handleFocus,
            onBlur: handleBlur,
            onMouseDown: handleInputMouseDown,
        } as Input,
        {
            label: 'Width',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'flex-1',
            onFocus: handleFocus,
            onBlur: handleBlur,
            onMouseDown: handleInputMouseDown,
        } as Input,
        {
            label: 'Length',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'flex-1',
            onFocus: handleFocus,
            onBlur: handleBlur,
            onMouseDown: handleInputMouseDown,
        } as Input,
        {
            label: 'Sub Components',
            renderType: 'repeater',
            type: 'static',
            className: 'w-full',
            rowClassName: 'flex gap-3 space-y-3',
            hideInitial: true,
            renderInputs: subComponentRenders,
            addButtonLabel: 'Add Sub Component',
        } as RepeaterInput,
    ];

    const supportingMaterialRenders: Input[] = [
        {
            label: 'Supporting Material',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'w-1/3',
            onFocus: handleFocus,
            onBlur: handleBlur,
            onMouseDown: handleInputMouseDown,
        } as Input,
        {
            label: 'Price',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'w-1/4',
            onFocus: handleFocus,
            onBlur: handleBlur,
            onMouseDown: handleInputMouseDown,
        } as Input,
    ];

    return (
        <div className={cn('space-y-3 p-8')}>
            <Paper elevation={3} className={cn('p-8')}>
                <Typography variant="h6" gutterBottom>
                    Components
                </Typography>
                <Repeater
                    inputRefs={inputRefs}
                    label="Components"
                    rowClassName={cn('flex flex-wrap gap-3 space-y-3')}
                    addButtonLabel="Add Component"
                    renderInputs={componentRenders}
                    onChange={(inputs) => {
                        flattenInputs(inputs);
                        setFormState((prev) => ({ ...prev, components: inputs }));
                    }}
                    value={formState.components}
                />
            </Paper>

            <Paper elevation={3} className={cn('p-8')}>
                <Typography variant="h6" gutterBottom>
                    Supporting Materials
                </Typography>
                <Repeater
                    inputRefs={inputRefs}
                    label="Supporting Materials"
                    rowClassName={cn('flex gap-3 space-y-3')}
                    addButtonLabel="Add Supporting Material"
                    renderInputs={supportingMaterialRenders}
                    onChange={(inputs) => {
                        flattenInputs(inputs);
                        setFormState((prev) => ({ ...prev, supportingMaterials: inputs }));
                    }}
                    value={formState.supportingMaterials}
                />
            </Paper>
        </div>
    );
}
