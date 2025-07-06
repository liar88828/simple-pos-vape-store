import { redirect } from "next/navigation";

export default async function page() {
    // const session = await getSessionUserPage()
    // console.log(payload)
    redirect('/login')

    // return <NotFound role={session?.role} />
}
