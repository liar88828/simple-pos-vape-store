import { redirect } from "next/navigation";

export default async function page() {
    redirect('/dashboard')
    return <p>Will redirect</p>
}
