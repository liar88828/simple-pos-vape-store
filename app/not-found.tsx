import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
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
                                <Link href="/">Return Home</Link>
                            </Button>
                        </CardAction>
                    </CardContent>
                </Card>
            </div>
        </div>

    )
}