import { Repeater } from '@/components/repeater';
import { cn } from '@/lib/utils';
import { AutocompleteInput, Input, RepeaterInput } from '@/types/input';
import { Paper, Typography } from '@mui/material';
import { PropsWithChildren, useCallback, useRef, useState } from 'react';

interface BomRecordProps {}

type InputMap = Record<string, Input>;

export default function BomRecord({ ...props }: PropsWithChildren<BomRecordProps>) {
    const [formState, setFormState] = useState<{
        components: Input[][];
        supportingMaterials: Input[][];
    }>({
        components: [],
        supportingMaterials: [],
    });

    const inputMapRef = useRef<InputMap>({});

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
            renderType: 'textfield',
            type: 'static',
            className: 'flex-1',
        } as Input,
        {
            label: 'Depth',
            renderType: 'textfield',
            type: 'static',
            className: 'flex-1',
        } as Input,
        {
            label: 'Width',
            renderType: 'textfield',
            type: 'static',
            className: 'flex-1',
        } as Input,
        {
            label: 'Length',
            renderType: 'textfield',
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
            renderType: 'textfield',
            type: 'static',
            className: 'flex-1',
        } as Input,
        {
            label: 'Depth',
            renderType: 'textfield',
            type: 'static',
            className: 'flex-1',
        } as Input,
        {
            label: 'Width',
            renderType: 'textfield',
            type: 'static',
            className: 'flex-1',
        } as Input,
        {
            label: 'Length',
            renderType: 'textfield',
            type: 'static',
            className: 'flex-1',
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
            renderType: 'textfield',
            type: 'static',
            className: 'w-1/3',
            options: [],
        } as AutocompleteInput,
        {
            label: 'Price',
            renderType: 'textfield',
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
        inputMapRef.current = map; // ✅ persist across renders
    }, []);

    return (
        <div className={cn('space-y-3 p-8')}>
            <Paper elevation={3} className={cn('p-8')}>
                <Typography variant="h6" gutterBottom>
                    Components
                </Typography>
                <Repeater
                    label="Components"
                    rowClassName={cn('flex flex-wrap gap-3 space-y-3')}
                    addButtonLabel="Add Component"
                    renderInputs={componentRenders}
                    onInputsChange={(inputs) => {
                        flattenInputs(inputs);
                        console.log(inputMapRef.current);
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
                    label="Supporting Materials"
                    rowClassName={cn('flex gap-3 space-y-3')}
                    addButtonLabel="Add Supporting Material"
                    renderInputs={supportingMaterialRenders}
                    onInputsChange={(inputs) => {
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
