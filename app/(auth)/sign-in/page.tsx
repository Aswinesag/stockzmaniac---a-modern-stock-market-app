'use client';

import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

type SignInFormData = {
    email: string;
    password: string;
};

const SignIn = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
        email: '',
        password: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: SignInFormData) => {
        try {
        console.log(data);
        // TODO: call auth API
        } catch (e) {
        console.error(e);
        }
    };

    return (
        <>
        <h1 className="form-title">Sign In</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <InputField
                name="email"
                label="Email"
                placeholder="john@example.com"
                register={register}
                error={errors.email}
                validation={{
                required: 'Email is required',
                pattern: {
                    value: /^\w+@\w+\.\w+$/,
                    message: 'Enter a valid email address',
                },
            }}
            />

        <InputField
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            register={register}
            error={errors.password}
            validation={{
            required: 'Password is required',
            minLength: 8,
            }}
            />

        <Button
            type="submit"
            disabled={isSubmitting}
            className="yellow-btn w-full mt-5"
        >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>

        <FooterLink
            text="Don't have an account?"
            linkText="Sign Up"
            href="/sign-up"
            />
        </form>
        </>
    );
};

export default SignIn;
