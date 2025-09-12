import { Repeater } from '@/components/repeater';
import { cn } from '@/lib/utils';
import { AutocompleteInput, Input, RepeaterInput } from '@/types/input';
import { Paper, Typography } from '@mui/material';
import { PropsWithChildren, startTransition, useCallback, useEffect, useState } from 'react';

interface BomRecordProps {}

export default function BomRecord({ ...props }: PropsWithChildren<BomRecordProps>) {
    const [allInputs, setAllInputs] = useState<Input[]>([]);

    const handleInputsChange = useCallback((label: string, inputs: Input[][]) => {
        startTransition(() => {
            setAllInputs((prev) => ({
                ...prev,
                [label]: flattenInputs(inputs.flat(1)),
            }));
        });
    }, []);

    const [subComponentInputs, setSubComponentInputs] = useState<Input[]>([
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
    ]);
    const [componentInputs, setComponentInputs] = useState<Input[]>([
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
            renderInputs: subComponentInputs,
            addButtonLabel: 'Add Sub Component',
        } as RepeaterInput,
    ]);

    const [supportingMaterialInputs, setSupportingMaterialInputs] = useState<Input[]>([
        {
            label: 'Supporting Material',
            renderType: 'autocomplete',
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
    ]);

    const supportingMaterialRenderInputs = supportingMaterialInputs.map((input) => {
        if (input.label === 'Supporting Material' && input.renderType === 'autocomplete') {
            return {
                ...input,
                options: Object.values(allInputs).flat(1).map((i) => i.id),
            } as AutocompleteInput;
        }
        return input;
    });

    function flattenInputs(inputs: Input[]): Input[] {
        const result: Input[] = [];

        inputs.forEach((input) => {
            if (input.renderType === 'repeater') {
                const repeater = input as RepeaterInput;

                if (Array.isArray(repeater.value)) {
                    repeater.value.forEach((nestedRow: Input[] | Input, rowIndex) => {
                        if (Array.isArray(nestedRow)) {
                            // nested row of inputs
                            result.push(...flattenInputs(nestedRow));
                        } else {
                            // single input (edge case)
                            result.push(nestedRow);
                        }
                    });
                }
            } else {
                result.push(input);
            }
        });

        return result;
    }

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
                    renderInputs={componentInputs}
                    onInputsChange={handleInputsChange}
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
                    renderInputs={supportingMaterialRenderInputs}
                    onInputsChange={handleInputsChange}
                />
            </Paper>
        </div>
    );
}
