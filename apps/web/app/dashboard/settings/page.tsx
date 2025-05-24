import { getLoggedInUserAction } from "@/actions/user.action";
import { redirect } from "next/navigation";
import HeaderBox from "../components/HeaderBox";
import SettingsComponent from "../components/SettingsComponent";

export default async function SettingsPage(){
    const user = await getLoggedInUserAction();
    if(!user) redirect('/login');
    return (   
        <section className="flex flex-col gap-4">
            <HeaderBox
                title="Settings"
                subtext="Manage your account settings"
                user={user.firstName}
            />
            <SettingsComponent user={user}/>
        </section>
    )
}