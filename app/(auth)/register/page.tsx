// RegisterPage.tsx
import RegisterPage from "@/components/auth/register-page";
import { logger } from "@/lib/logger";
import React from 'react';

function Page() {
    logger.info("Page loaded : RegisterPage");

    return (
        <RegisterPage/>
    );
}

export default Page;