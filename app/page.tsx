import { getSessionUser } from "@/action/auth-action";
import NotFound from "./not-found";

export default async function page() {
    const session = await getSessionUser()
    // console.log(payload)
    // redirect('/')
    return <NotFound role={session?.role} />
}
