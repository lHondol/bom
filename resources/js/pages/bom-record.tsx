import { Repeater } from '@/components/repeater';
import { cn } from '@/lib/utils';
import { AutocompleteInput, Input, RepeaterInput } from '@/types/input';
import { Paper, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';

type InputMap = Record<string, Input>;

export default function BomRecord() {
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const [formState, setFormState] = useState<{
        components: Input[][];
        supportingMaterials: Input[][];
    }>({
        components: [],
        supportingMaterials: [],
    });

    const [disabledMap, setDisabledMap] = useState<Record<string, boolean>>({});

    const inputMapRef = useRef<InputMap>({});

    const handleOnFocus = (id: string) => {
        setDisabledMap(() => {
            const map: Record<string, boolean> = {};
            Object.keys(inputRefs.current).forEach((key) => {
                map[key] = id !== key;
            });
            return map;
        });
    };

    const disabled = (id: string): boolean => {
        return disabledMap[id];
    }

    const subComponentRenders = [
        {
            label: 'Sub Component',
            renderType: 'autocomplete',
            type: 'static',
            className: 'flex-2',
            options: ['Lipping', 'Veener', 'Core'],
        } as AutocompleteInput,
        {
            label: 'Quantity',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'flex-1',
        } as Input,
        {
            label: 'Depth',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'flex-1',
        } as Input,
        {
            label: 'Width',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'flex-1',
        } as Input,
        {
            label: 'Length',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'flex-1',
        } as Input,
    ];

    const componentRenders = [
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
            onFocus: handleOnFocus,
        } as Input,
        {
            label: 'Depth',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'flex-1',
            onFocus: handleOnFocus,
        } as Input,
        {
            label: 'Width',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'flex-1',
            onFocus: handleOnFocus,
        } as Input,
        {
            label: 'Length',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'flex-1',
            onFocus: handleOnFocus,
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

    const supportingMaterialRenders = [
        {
            label: 'Supporting Material',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'w-1/3',
            options: [],
        } as AutocompleteInput,
        {
            label: 'Price',
            renderType: 'formulatextfield',
            type: 'static',
            className: 'w-1/4',
        } as Input,
    ];

    const flattenInputs = useCallback((inputs: Input[][]) => {
        const map: InputMap = {};
        const recursive = (rows: Input[][]) => {
            if (!Array.isArray(rows)) return;

            rows.forEach((row) => {
                if (!Array.isArray(row)) return;

                row.forEach((input) => {
                    if (!input || typeof input !== 'object') return;

                    const typedInput = input as Input;
                    map[typedInput.id as string] = typedInput;

                    if (typedInput.renderType == 'repeater') {
                        const nestedRows = typedInput.value as Input[][];
                        recursive(nestedRows);
                    }
                });
            });
        };
        recursive(inputs);
        inputMapRef.current = map; // persist across renders
    }, []);

    return (
        <div className={cn('space-y-3 p-8')}>
            <Paper elevation={3} className={cn('p-8')}>
                <Typography variant="h6" gutterBottom>
                    Components
                </Typography>
                <Repeater
                    inputRefs={inputRefs}
                    disableMap={disabledMap}
                    label="Components"
                    rowClassName={cn('flex flex-wrap gap-3 space-y-3')}
                    addButtonLabel="Add Component"
                    renderInputs={componentRenders}
                    onChange={(inputs) => {
                        flattenInputs(inputs);
                        setFormState((prev) => ({
                            ...prev,
                            components: inputs,
                        }));
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
                        setFormState((prev) => ({
                            ...prev,
                            supportingMaterials: inputs,
                        }));
                    }}
                    value={formState.supportingMaterials}
                />
            </Paper>
        </div>
    );
}
