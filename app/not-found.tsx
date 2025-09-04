import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link'
import { match } from 'ts-pattern';

export default function NotFound({ role }: { role?: string }) {

    const homeLink = match(role)
        .with("USER", () => "/user/home")
        .with("ADMIN", () => "/admin/dashboard")
        .otherwise(() => "/login");



    return (
        <div className="w-full flex justify-center items-center mt-[20vw]">
            <div className="w-auto max-w-xl  ">
                <Card className=" min-w-md">
                    <CardHeader>
                        <CardTitle>Not Found</CardTitle>
                        <CardDescription>Could not find requested resource</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CardAction>
                            <Button>
                                <Link
                                    //@ts-expect-error
                                    href={ homeLink }>Return Home</Link>
                            </Button>
                        </CardAction>
                    </CardContent>
                </Card>
            </div>
        </div>

    )
}