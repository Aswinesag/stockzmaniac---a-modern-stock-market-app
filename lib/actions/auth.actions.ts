'use server';
import { auth } from '@/lib/better-auth/auth';
import { inngest } from '@/lib/inngest/client';
import { headers } from 'next/headers';

export const signUpWithEmail = async ({email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry} : SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({
            body : {email, password, name: fullName}
        })
        if(response) {
            await inngest.send({
                name: 'app/user.created',
                data: {
                    email,
                    name: fullName,
                    country,
                    investmentGoals,
                    riskTolerance,
                    preferredIndustry
                }
            })
        }
        return {success: true, data: response}
    } catch (e) {
        console.log("Sign Up failed", e);
        return {success: false, error: 'Sign Up failed'}
    }
}

export const signInWithEmail = async ({email, password} : SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({
            body : {email, password}
        })
        return {success: true, data: response}
    } catch (e) {
        console.log("Sign In failed", e);
        return {success: false, error: 'Sign In failed'}
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({headers: await headers()})
    } catch (e) {
        console.log("Sign Out failed", e);
        return {success: false, error: "Sign Out failed"}
    }
}

export const getCurrentUser = async () => {
    try {
        // Get the session using Better Auth
        const session = await auth.api.getSession({
            headers: await headers()
        });
        
        if (!session?.session || !session?.user) {
            return null;
        }
        
        // Return the user object with proper typing
        const user = session.user;
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            // Add any other user properties you need
        };
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

export const getCurrentUserId = async (): Promise<string | null> => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        
        return session?.user?.id || null;
    } catch (error) {
        console.error('Error getting current user ID:', error);
        return null;
    }
}