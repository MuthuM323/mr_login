//holds the MemberData for input fields
export type MemberData = {
    subId: string;
    code: string;
    ssn: string;
    zipCode: string;
    firstName: string;
    lastName: string;
    DOB: string;
}

export type MemberVerify = {
    IdType: string;
    zip: string;
    first: string;
    last: string;
    date: string;
}

export type MemberAccount = {
    username: string;
    password: string;
    email: string;
    verifiedEmail: string;
    mobilePhone: string;
    homePhone: string;
    selected1: string;
    answered1: string;
    selected2: string;
    answered2: string;
    selected3: string;
    answered3: string;
}

export interface TabItem {
    displayLine1: string;
    displayLine2: string;
    current: boolean;
    large: boolean;
}

export interface UserData {
    showAccountSharing: boolean;
    firstName?: string;
    lastName?: string;
    policyHolderFirstName?: string;
    policyHolderLastName?: string;
    requestToken?: string;
    nonce?: string;
    username?: string;
    email?: string;
    userExists?: boolean;
}

export interface SecurityQuestion {
    questionText: string;
}

export interface IdOption {
    key: string;
    value: string;
}
