// Generic helper to get any query param key dynamically
import { ContextPage } from "@/interface/actionType";

export async function getContextPage<K extends keyof Awaited<ContextPage['searchParams']>>(
    context: ContextPage,
    key: K
){
    const searchParams = await context.searchParams;
    return searchParams[key];
}