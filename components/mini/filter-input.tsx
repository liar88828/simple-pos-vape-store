import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { HTMLInputTypeAttribute } from "react";

export function FilterInput(
    {
        type = 'text',
        label,
        value,
        onChangeAction,
        placeholder,
    }: {
        label: string;
        type?: HTMLInputTypeAttribute;
        value: string;
        onChangeAction: (val: string) => void;
        placeholder: string;
    }
) {
    return (
        <div>
            <Label>{ label }</Label>
            <Input
                type={ type }
                value={ value }
                placeholder={ placeholder }
                onChange={ e => onChangeAction(e.target.value) }
                className="w-full min-w-6"/>

        </div>
    );
}

export function FilterSelect(
    {
        label,
        value,
        onChangeAction,
        placeholder,
        options,
        labelClassName
    }: {
        label: string;
        value: string;
        onChangeAction: (val: string) => void;
        placeholder: string;
        options: {
            label: string;
            value: string;
        }[];
        labelClassName?: string;
    }
) {
    return (
        <div>
            <Label className={ labelClassName }>{ label }</Label>
            <Select value={ value } onValueChange={ onChangeAction }>
                <SelectTrigger className="w-full min-w-6">
                    <SelectValue placeholder={ placeholder }/>
                </SelectTrigger>
                <SelectContent>
                    { options.map((item) => (
                        <SelectItem key={ item.value } value={ item.value }>
                            { item.label }
                        </SelectItem>
                    )) }
                </SelectContent>
            </Select>
        </div>
    );
}
