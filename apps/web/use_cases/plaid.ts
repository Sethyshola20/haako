import { createLinkToken } from "@/actions/plaid.action";

export async function getPlaidTokenUseCase() {
    try {
    return    await createLinkToken()
    }catch (error) {
        console.log(error)
    }
}