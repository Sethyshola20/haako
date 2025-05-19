import { IAuthentificatedUser } from "@data-access/user";

export class UnknownError {
    constructor(error: unknown) {
        return {
            status: 500,
            message: error instanceof Error ? error.message : "Erreur inconnue",
        };
    }
}

export interface IApiCallResponse {
    status: number,
    message: string
}
export interface IRegisterResponse extends IApiCallResponse {
    action: string
}

export interface ILoginLink extends IApiCallResponse {
    status: 301;
    user: null;
    lien: string;
}

export interface ILoginResponse extends IApiCallResponse {
    user: IAuthentificatedUser | null,
    lien: string | null
}

export class SuccessfulRegistration implements IRegisterResponse {
    constructor(
        public status: number,
        public message: string,
        public action: string
    ) { }

}

export class SuccesfulLogin implements ILoginResponse {
    public lien: string | null = null; // Lien is not used here, default it to null

    constructor(
        public status: number,
        public message: string,
        public user: IAuthentificatedUser | null
    ) { }
}

export class BadResponse implements IApiCallResponse {
    constructor(
        public status: number,
        public message: string
    ) { }
}
export class UnconfirmedEmail {
    constructor(
        public status: number,
        public message: string,
        public user: IAuthentificatedUser | null
    ) { }

}

export class LinkLogin implements IApiCallResponse {
    public user: IAuthentificatedUser | null = null; // User is not used here, default it to null

    constructor(
        public status: number,
        public message: string,
        public lien: string | null
    ) { }
}
