'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from 'react';

const queryClient = new QueryClient({
        defaultOptions: {
            queries: {

                gcTime: 60 * 60 * 24, // 24 hours
            },
        }
    },
)

function ProviderComponent({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={ queryClient }>
            {/*<ReactQueryDevtools initialIsOpen={false} />*/ }
            { children }

        </QueryClientProvider>
    );
}

export default ProviderComponent;