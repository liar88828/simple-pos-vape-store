import LoginPage from "@/components/auth/login-page";
import { logger } from "@/lib/logger";
import React from 'react';

function Page() {
    logger.info("Page loaded : LoginPage");
    return (<LoginPage/>
    )
}

export default Page;