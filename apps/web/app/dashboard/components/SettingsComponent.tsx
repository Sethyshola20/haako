"use client"

import PlaidLink from "@/app/(auth)/components/auth/PlaidLink"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { UpdateUserFormDataType, updateUserSchema } from "@/types/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export default function SettingsComponent({user}: {user: User}) {
    
    
    return (
        <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
                <label>Connect a bank account</label>
                <PlaidLink user={user}/>
            </div>
            <UpdateUserForm user={user}/>
        </section>
    )
}

export function UpdateUserForm({user}: {user: User}) {
    const { updateUser } = useAuth()
    const form = useForm<UpdateUserFormDataType>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            state: user.state,
            city: user.city,
        },
    })

    const { isSubmitting } = form.formState

    async function onSubmit(data: UpdateUserFormDataType) {
        updateUser(data)
    }

    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                        <Input
                            required 
                            placeholder="Doe" 
                            autoCapitalize="none" 
                            autoCorrect="off"
                            disabled={isSubmitting}
                            {...field} 
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                        <Input
                            required
                            placeholder="John"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={isSubmitting}
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                        <Input
                            required
                            placeholder="Paris"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={isSubmitting}
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                        <Input
                            required
                            placeholder="Paris"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={isSubmitting}
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                        Date of Birth
                        </FormLabel>
                        <FormControl>
                        <Input
                            required 
                            placeholder="2000-01-01" 
                            autoCapitalize="none" 
                            autoCorrect="off"
                            disabled={isSubmitting}
                            {...field} 
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}