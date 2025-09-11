import { Repeater } from '@/components/repeater';
import { cn } from '@/lib/utils';
import { AutocompleteInput, Input, RepeaterInput } from '@/types/input';
import { PropsWithChildren, useMemo, useState } from 'react';

interface BomRecordProps {}

export default function BomRecord({ ...props }: PropsWithChildren<BomRecordProps>) {
    const [subComponentInputs, setSubComponentInputs] = useState<Input[]>([
        {
            label: 'Sub Component',
            renderType: 'autocomplete',
            type: 'static',
            className: 'w-1/4',
            options: ['Lipping', 'Veener', 'Core'],
        } as AutocompleteInput,
        {
            label: 'Quantity',
            renderType: 'textfield',
            type: 'static',
            className: 'w-1/4',
        } as Input,
        {
            label: 'Depth',
            renderType: 'textfield',
            type: 'static',
            className: 'w-1/4',
        } as Input,
        {
            label: 'Width',
            renderType: 'textfield',
            type: 'static',
            className: 'w-1/4',
        } as Input,
        {
            label: 'Length',
            renderType: 'textfield',
            type: 'static',
            className: 'w-1/4',
        } as Input,
    ]);
    const [componentInputs, setComponentInputs] = useState<Input[]>([
        {
            label: 'Component',
            renderType: 'autocomplete',
            type: 'static',
            className: 'w-1/4',
            options: ['Tiang Samping', 'Ambang Atas', 'Ambang Bawah'],
        } as AutocompleteInput,
        {
            label: 'Quantity',
            renderType: 'textfield',
            type: 'static',
            className: 'w-1/4',
        } as Input,
        {
            label: 'Depth',
            renderType: 'textfield',
            type: 'static',
            className: 'w-1/4',
        } as Input,
        {
            label: 'Width',
            renderType: 'textfield',
            type: 'static',
            className: 'w-1/4',
        } as Input,
        {
            label: 'Length',
            renderType: 'textfield',
            type: 'static',
            className: 'w-1/4',
        } as Input,
        {
            label: 'Sub Component',
            renderType: 'repeater',
            type: 'static',
            className: 'w-full',
            hideInitial: true,
            renderInputs: subComponentInputs,
            onInputsChange: (inputs: Input[][]) => {
                console.log(inputs);
            },
        } as RepeaterInput,
    ]);

    const allInputs = useMemo(() => {
        return [...componentInputs];
    }, [componentInputs]);

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
        <div>
            <Repeater
                rowClassName={cn('flex')}
                renderInputs={componentInputs}
                onInputsChange={(inputs) => {
                    console.log(flattenInputs(inputs.flat(1)));
                }}
            />
        </div>
    );
}
