'use client'

import { registerAction } from "@/action/auth-action";
import { InputForm } from "@/components/mini/form-hook";
import { SlideTransition } from "@/components/mini/slide-transition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { RegisterFormData, registerSchema } from "@/lib/auth-schema";
import { toastResponse } from "@/lib/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function RegisterPage() {
    const [ isPending, startTransition ] = useTransition()
    const route = useRouter()

    const methods = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        } satisfies RegisterFormData,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        startTransition(async () => {

        console.log("Registering:", data);
        toastResponse({ response: await registerAction(data) })
        })
    });

    return (
        <div className="w-full max-w-sm md:max-w-3xl">
            <div className="flex flex-col gap-6">
                <Card className="overflow-hidden p-0">
                    {/*<CardHeader>*/ }
                    {/*    <CardTitle>Register</CardTitle>*/ }
                    {/*    <CardDescription>Create a new account ✨</CardDescription>*/ }
                    {/*</CardHeader>*/ }

                    <CardContent className="grid p-0 md:grid-cols-2">

                        <SlideTransition name={ 'image-page' }>
                            <div className="bg-muted relative hidden md:block">
                                <picture>
                                <img
                                    src="https://images.pexels.com/photos/6963094/pexels-photo-6963094.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    alt="Image"
                                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                                />
                                </picture>
                            </div>
                        </SlideTransition>
                        <FormProvider { ...methods }>
                            <form onSubmit={ onSubmit } className="p-6 md:p-8">
                                <div className="flex flex-col gap-6">

                                    <div className="flex flex-col items-center text-center">

                                        <CardTitle>Register</CardTitle>
                                        <CardDescription>Create a new account ✨</CardDescription>
                                    </div>
                                    <InputForm name="name" title="Name" placeholder="Your full name"/>
                                    <InputForm
                                        name="email"
                                        title="Email"
                                        placeholder="you@example.com"
                                        type="email"
                                    />
                                    <InputForm
                                        name="password"
                                        title="Password"
                                        placeholder="********"
                                        type="password"
                                    />
                                    <InputForm
                                        name="confirmPassword"
                                        title="Confirm Password"
                                        placeholder="Repeat password"
                                        type="password"
                                    />
                                    <CardFooter className="flex-col gap-2 w-full   p-0">
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={ isSubmitting || isPending }>
                                            { isSubmitting || isPending ? "Registering..." : "Register" }
                                        </Button>
                                        <Button
                                            disabled={ isSubmitting || isPending }
                                            type="button"
                                                variant={ 'outline' }
                                                onClick={ () => route.push('/login') } className={ 'w-full' }>
                                            Back
                                        </Button>

                                    </CardFooter>
                                </div>
                            </form>
                        </FormProvider>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}