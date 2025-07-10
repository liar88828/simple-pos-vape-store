'use client'
import { newParam } from "@/lib/helper";
import { useRouter } from "next/navigation"; // or "next/navigation" if you're using app router
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 500): T {
    const [ debouncedValue, setDebouncedValue ] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [ value, delay ]);

    return debouncedValue;
}

export function useDebounceLoad<T>(value: T, delay = 500) {
    const [ debouncedValue, setDebouncedValue ] = useState(value);
    const [ isLoading, setIsLoading ] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        const handler = setTimeout(() => {
            setDebouncedValue(value);
            setIsLoading(false);
        }, delay);

        return () => clearTimeout(handler);
    }, [ value, delay ]);

    return { value: debouncedValue, isLoading }
}

// Debounced router navigation
export function useDebounceRouter_xxx(
    value: Record<string, string | undefined>,
    delay = 500
) {
    const [ debouncedValue, setDebouncedValue ] = useState(value);
    const [ isLoading, setIsLoading ] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);

        const handler = setTimeout(() => {
            setDebouncedValue(value);
            setIsLoading(false);
        }, delay);

        return () => clearTimeout(handler);
    }, [ value, delay ]);

    useEffect(() => {
        // Only navigate if there's at least one non-empty string
        const hasQuery = Object.values(debouncedValue).some(
            (val) => typeof val === "string" && val.trim() !== ""
        );

        if (hasQuery) {
            router.push(newParam(debouncedValue));
        }
    }, [ debouncedValue, router ]);

    return { value: debouncedValue, isLoading };
}

export function usePushQueryObject_(params: Record<string, string | undefined>) {
    const router = useRouter();

    const hasValue = Object.values(params).some(
        (val) => typeof val === "string" && val.trim() !== ""
    );

    useEffect(() => {
        if (hasValue) {
            router.push(newParam(params));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ hasValue, ]); // <== avoids infinite loop
}

export function usePushQueryObject(params: Record<string, string | undefined>) {
    const router = useRouter();

    useEffect(() => {
        router.push(newParam(params));
        console.log('push query', params);
    }, [ params,router ]); // <== avoids infinite loop
}