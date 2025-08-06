'use client'
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// components/EmptyData.tsx
import { AlertCircle, Ban, RefreshCw, SearchX } from "lucide-react"
import { useRouter } from "next/navigation";
import React from 'react';

export function EmptyData({ message = "No data available" }: { message?: string }) {
    return (
        <Card className="w-full text-center py-10">
            <CardContent className="flex flex-col items-center justify-center gap-4">
                <Ban className="h-12 w-12 text-muted-foreground"/>
                <p className="text-muted-foreground text-sm">{ message }</p>
            </CardContent>
        </Card>
    )
}

export function EmptyDataPage({ message = "No data available" }: { message?: string }) {

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <EmptyData message={ message }/>
        </div>
    );
}

type DataNotFoundProps = {
    title?: string;
    description?: string;
    message?: string;
    showRetry?: boolean;
    showReset?: boolean;
    onRetryAction?: () => void;
    onResetAction?: () => void;
};

export function DataNotFound(
    {
        title = "No Data Found",
        description = "We couldn't find any data matching your current criteria.",
        message = "Try adjusting your search filters or check your connection.",
        showRetry = true,
        showReset = true,
        onRetryAction,
        onResetAction
    }: DataNotFoundProps) {
    const router = useRouter();

    const handleRetry = () => {
        if (onRetryAction) {
            onRetryAction();

        } else {
            // Placeholder for retry logic
            console.log('Retrying data fetch...');
            router.refresh()

        }
    };

    const handleReset = () => {
        if (onResetAction) {
            onResetAction();
        } else {
            // Placeholder for reset logic
            console.log('Resetting filters...');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader className="pb-4">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-muted rounded-full">
                            <SearchX className="h-8 w-8 text-muted-foreground"/>
                        </div>
                    </div>
                    <CardTitle className="text-xl font-semibold">{ title }</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        { description }
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Alert>
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>
                            { message }
                        </AlertDescription>
                    </Alert>

                    { (showRetry || showReset) && (
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            { showRetry && (
                                <Button
                                    variant="outline"
                                    onClick={ handleRetry }
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw className="h-4 w-4"/>
                                    Retry
                                </Button>
                            ) }
                            {/*{ showReset && (*/ }
                            {/*    <Button*/ }
                            {/*        variant="default"*/ }
                            {/*        onClick={ handleReset }*/ }
                            {/*    >*/ }
                            {/*        Reset Filters*/ }
                            {/*    </Button>*/ }
                            {/*) }*/ }
                        </div>
                    ) }

                    <div className="text-xs text-muted-foreground mt-4">
                        <p>Still having trouble? Contact support for assistance.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}