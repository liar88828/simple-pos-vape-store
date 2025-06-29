import React, { HTMLInputTypeAttribute } from 'react';
import { ControllerRenderProps, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"; // adjust the import path
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react"; // or your own UI
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"

type FormHookProps = {
    name: string;
    type?: HTMLInputTypeAttribute;
    title: string;
    description?: string;
    placeholder?: string;
    disabled?: boolean;
};

export function InputNumForm({ name, description, placeholder, title, disabled, type = 'text' }: FormHookProps) {
    const { control } = useFormContext(); // retrieve control from context

    return (
        <div>
            <FormField
                control={ control }
                name={ name }
                render={ ({ field }: { field: ControllerRenderProps, }) => (
                    <FormItem className="col-span-2 ">
                        {/* bg-red-300 rounded-md */ }
                        <FormLabel className={ disabled ? 'text-primary/50' : "" }>{ title }</FormLabel>
                        <FormControl>
                            <Input
                                type={ type === "number" ? "text" : type }
                                disabled={ disabled }
                                placeholder={ placeholder }
                                value={
                                    type === "number" && typeof field.value === "number"
                                        ? new Intl.NumberFormat("id-ID").format(field.value)
                                        : field.value ?? ""
                                }
                                onChange={ (e) => {
                                    const raw = e.target.value.replace(/\./g, "").replace(/[^0-9]/g, "");
                                    const parsed = raw === "" ? undefined : Number(raw);
                                    if (type === "number") {
                                        field.onChange(parsed);
                                    } else {
                                        field.onChange(e.target.value);
                                    }
                                } }
                            />
                        </FormControl>
                        { description && <FormDescription>{ description }</FormDescription> }
                        <FormMessage/>
                    </FormItem>
                ) }
            />
        </div>
    );
}
export function InputForm({ name, description, placeholder, title, disabled, type = 'text' }: FormHookProps) {
    const { control } = useFormContext(); // retrieve control from context

    return (
        <div>
            <FormField
                control={ control }
                name={ name }
                render={ ({ field }: { field: ControllerRenderProps, }) => (
                    <FormItem className="col-span-2 ">
                        {/* bg-red-300 rounded-md */ }
                        <FormLabel className={ disabled ? 'text-primary/50' : "" }>{ title }</FormLabel>
                        <FormControl>
                            <Input
                                type={ type }
                                disabled={ disabled }
                                placeholder={ placeholder }
                                { ...field }
                                onChange={ (e) => {
                                    const { value } = e.target;

                                    if (type === "number") {
                                        field.onChange(value === "" ? undefined : Number(value));
                                    } else if (type === "date") {
                                        field.onChange(value === "" ? undefined : (value));
                                    } else if (type === "date" || type === "datetime-local") {
                                        field.onChange(value === "" ? undefined : new Date(value));
                                    } else {
                                        field.onChange(value);
                                    }
                                } }
                            />
                        </FormControl>
                        { description && <FormDescription>{ description }</FormDescription> }
                        <FormMessage/>
                    </FormItem>
                ) }
            />
        </div>
    );
}

export function InputDateForm({ name, title, description }: Omit<FormHookProps, 'type' | 'placeholder'>) {
    const { control } = useFormContext(); // retrieve control from context

    return (
        <div>
            <FormField
                control={ control }
                name={ name }
                render={ ({ field }: { field: ControllerRenderProps, }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>{ title }</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild className={ 'w-full' }>
                                <FormControl>
                                    <Button
                                        variant={ "outline" }
                                        className={ cn(
                                            "w-full   pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        ) }
                                    >
                                        { field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        ) }
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={ field.value }
                                    onSelect={ field.onChange }
                                    disabled={ (date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormDescription>{ description }</FormDescription>

                        <FormMessage/>
                    </FormItem>
                ) }
            />
        </div>
    );
}

export function TextareaForm({ name, placeholder, title, description }: FormHookProps) {
    const { control } = useFormContext(); // retrieve control from context

    return (
        <div>
            <FormField
                control={ control }
                name={ name }
                render={ ({ field }: { field: ControllerRenderProps }) => (
                    <FormItem className="col-span-2">
                        <FormLabel>{ title }</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder={ placeholder }
                                { ...field } />
                        </FormControl>
                        <FormDescription>{ description }</FormDescription>

                        <FormMessage/>
                    </FormItem>
                ) }
            />
        </div>
    );
}

type SelectHookProps = {
    name: string;
    label: string;
    placeholder?: string;
    description?: string;
    options: { label: string; value: string }[];
};

export function SelectForm({ name, label, placeholder = "Pilih...", options, description }: SelectHookProps) {
    const { control } = useFormContext();

    return (
        <div>
            <FormField
                control={ control }
                name={ name }
                render={ ({ field }: { field: ControllerRenderProps }) => (
                    <FormItem>
                        <FormLabel>{ label }</FormLabel>
                        <FormControl>

                            <Select
                                onValueChange={ field.onChange }
                                defaultValue={ field.value }
                                value={ field.value }
                            >
                                <SelectTrigger className={ 'w-full' }>
                                    <SelectValue placeholder={ placeholder }/>
                                </SelectTrigger>
                                <SelectContent>
                                    { options.map((option) => (
                                        <SelectItem key={ option.value } value={ option.value }>
                                            { option.label }
                                        </SelectItem>
                                    )) }
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormDescription>{ description }</FormDescription>
                        <FormMessage/>
                    </FormItem>
                ) }
            />

        </div>
    );
}

type DatePickerProps = {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
}

export function DatePickerForm({ date, setDate }: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={ "outline" }
                    className={ cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    ) }
                >
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    { date ? format(date, "PPP") : <span>Pick a date</span> }
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={ date }
                    onSelect={ setDate }
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

export function SwitchForm({
                               name,
                               title,
                               description,
                               bordered = false
                           }: Omit<FormHookProps, 'type' | 'placeholder'> & { bordered?: boolean }) {
    const { control } = useFormContext(); // retrieve control from context

    return (

        <FormField
            control={ control }
            name={ name }
            render={ ({ field }) => (
                <FormItem

                    className={ cn("flex flex-row items-center justify-between", {
                        'shadow-sm rounded-lg border p-3': bordered
                    }) }>
                    <div className="space-y-1">
                        <FormLabel>{ title }</FormLabel>
                        <FormDescription>{ description }</FormDescription>
                    </div>
                    <FormControl>
                        <Switch
                            checked={ field.value }
                            onCheckedChange={ field.onChange }
                        />
                    </FormControl>
                </FormItem>
            ) }
        />
    )
}

export function SwitchOnlyForm({ name, onChange }: { name: string, onChange?: (value: boolean) => void }) {
    const { control } = useFormContext();
    return (
        <FormField
            control={ control }
            name={ name }
            render={ ({ field }) => (
                <FormItem>
                    <FormControl>
                        <Switch
                            checked={ field.value }
                            onCheckedChange={ (value) => {
                                field.onChange(value); // Update the form state
                                onChange?.(value);     // Call external handler if provided
                            } }
                        />
                    </FormControl>
                </FormItem>
            ) }
        />
    )
}
