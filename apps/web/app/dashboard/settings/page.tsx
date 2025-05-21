import { getLoggedInUserAction } from "@/actions/user.action";
import PlaidLink from "@/app/(auth)/components/auth/PlaidLink";
import { redirect } from "next/navigation";

export default async function SettingsPage(){
    const user = await getLoggedInUserAction();
    if(!user) redirect('/login');
    return (   
        <section className="p-8">
            <PlaidLink user={user}/>
        </section>
    )
}