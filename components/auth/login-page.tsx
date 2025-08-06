'use client'
import { loginAction } from "@/action/auth-action";
import { InputForm } from "@/components/mini/form-hook";
import { SlideTransition } from "@/components/mini/slide-transition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { LoginFormData, loginSchema } from "@/lib/auth-schema";
import { toastResponse } from "@/lib/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
// 1. Define your Zod schema
import { FormProvider, useForm } from "react-hook-form";

export default function LoginPage() {
    const route = useRouter()
    const [ errorAction, setErrorAction ] = useState<string | null>(null)

    const methods = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        } satisfies LoginFormData,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        console.log("Login data:", data);
        // your login logic here
        setErrorAction(null);
        const response = await loginAction(data)
        toastResponse({
            response,
            onFailure: () => {
                setErrorAction(response.message);
            }
        })

    });

    return (
        <div className="w-full max-w-sm md:max-w-3xl">
                <Card className="overflow-hidden p-0">
                    {/*<CardHeader>*/ }
                    {/*    <CardTitle>Welcome Back 👋</CardTitle>*/ }
                    {/*    <CardDescription>Please enter your login credentials to access your*/ }
                    {/*        account.</CardDescription>*/ }
                    {/*</CardHeader>*/ }

                    <CardContent className="grid p-0 md:grid-cols-2">
                        <FormProvider { ...methods }>
                            <form onSubmit={ onSubmit } className="p-6 md:p-8">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col items-center text-center">
                                        {/*<h1 className="text-2xl font-bold">Welcome back</h1>*/ }
                                        {/*<p className="text-muted-foreground text-balance">*/ }
                                        {/*    Login to your Acme Inc account*/ }
                                        {/*</p>*/ }
                                        <CardTitle>Welcome Back 👋</CardTitle>
                                        <CardDescription>Please enter your login credentials to access your
                                            account.</CardDescription>
                                    </div>
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

                                    {/*<div className="flex items-center justify-between text-sm">*/ }
                                    {/*    <label className="flex items-center gap-2">*/ }
                                    {/*        <input*/ }
                                    {/*            type="checkbox"*/ }
                                    {/*            { ...methods.register("remember") }*/ }
                                    {/*            className="rounded border-gray-300"*/ }
                                    {/*        />*/ }
                                    {/*        Remember me*/ }
                                    {/*    </label>*/ }
                                    {/*    <Button size={ 'sm' }*/ }
                                    {/*            onClick={ () => route.push('/register') }*/ }
                                    {/*            variant={ 'link' }>*/ }
                                    {/*        Forgot password?*/ }
                                    {/*    </Button>*/ }
                                    {/*</div>*/ }
                                    { errorAction &&
											<p className={ 'text-destructive text-xs' }>{ errorAction }</p> }
                                    <CardFooter className="flex-col gap-2 w-full   p-0">

                                        <Button type="submit" disabled={ isSubmitting } className={ 'w-full' }>
                                            { isSubmitting ? "Logging in..." : "Login" }
                                        </Button>
                                        <Button type="button"
                                                variant={ 'outline' }
                                                onClick={ () => route.push('/register') } className={ 'w-full' }>
                                            Not Have Account
                                        </Button>
                                    </CardFooter>

                                </div>
                            </form>
                        </FormProvider>
                        <SlideTransition name={ 'image-page' }>
                            <div className="bg-muted relative hidden md:block">
                                <picture>

                                <img
                                    src="https://images.pexels.com/photos/2463125/pexels-photo-2463125.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    alt="Image"
                                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                                />
                                </picture>

                            </div>
                        </SlideTransition>
                    </CardContent>
                </Card>
        </div>
    );
};