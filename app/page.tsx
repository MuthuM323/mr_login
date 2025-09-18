'use client'

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Step1 from '@/components/forms/Step1';
import Step2 from '@/components/forms/Step2';
import Step3 from '@/components/forms/Step3';
import { AuthTokens } from '@/services/memberSplitService';

interface TabItem {
    displayLine1: string;
    displayLine2: string;
    current: boolean;
    large: boolean;
}

interface UserData {
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

export default function HomePage() {
    const [step1Complete, setStep1Complete] = useState(false);
    const [step2Complete, setStep2Complete] = useState(false);

    
    const [tabList, setTabList] = useState<TabItem[]>([
        {
            displayLine1: "Verify Your Identity",
            displayLine2: "",
            current: true,
            large: true
        },
        {
            displayLine1: "Set Up Your Account",
            displayLine2: "",
            current: false,
            large: true
        },
    ]);

    const [tabList1, setTabList1] = useState<TabItem[]>([
        {
            displayLine1: "Verify Your Identity",
            displayLine2: "",
            current: true,
            large: true
        },
        {
            displayLine1: "Set Up Your Account",
            displayLine2: "",
            current: false,
            large: true
        },
        {
            displayLine1: "Account Sharing",
            displayLine2: "",
            current: false,
            large: true
        },
    ]);

    const [userData, setUserData] = useState<UserData>({
        showAccountSharing: false
    });

    const [newData, setNewData] = useState<Partial<AuthTokens>>({});

    const updateStep = () => {
        if (!userData.showAccountSharing) {
            if (tabList[0].current && !step1Complete) {
                const newTabList = [...tabList];
                newTabList[0].current = false;
                newTabList[1].current = true;
                setTabList(newTabList);
                
                const newTabList1 = [...tabList1];
                newTabList1[0].current = false;
                newTabList1[1].current = true;
                setTabList1(newTabList1);
                
                setStep1Complete(true);
            }
            else if (tabList[1].current && !step2Complete) {
                const newTabList = [...tabList];
                newTabList[1].current = false;
                setTabList(newTabList);
                setStep2Complete(true);
            }
        }
        if (userData.showAccountSharing) {
            if (tabList1[0].current && !step1Complete) {
                const newTabList1 = [...tabList1];
                newTabList1[0].current = false;
                newTabList1[1].current = true;
                setTabList1(newTabList1);
                
                const newTabList = [...tabList];
                newTabList[0].current = false;
                setTabList(newTabList);
                
                setStep1Complete(true);
            }
            else if (tabList1[1].current && !step2Complete) {
                const newTabList1 = [...tabList1];
                newTabList1[1].current = false;
                newTabList1[2].current = true;
                setTabList1(newTabList1);
                
                const newTabList = [...tabList];
                newTabList[1].current = false;
                setTabList(newTabList);
                
                setStep2Complete(true);
            }
        }
    };

    const handleSetUserData = (data: UserData) => {
        setUserData(data);
    };

    const handleSetNewData = (data: Partial<AuthTokens>) => {
        setNewData(data);
    };

    return (
        <div className="wrap">
            <Header />
            <hr className="bluebar" />
            <div className="standard-indent">
                <div>
                    <h4 className={!tabList[0].current ? "" : "hidden"}>
                        Create a new <span className="italic">my</span>Blue Account for{" "}
                        {userData.firstName} {userData.lastName}
                    </h4>
                    <p className={`standard-top-margin ${tabList1[2].current ? "" : "hidden"}`}>
                        All fields are required
                    </p>
                    <p className={`standard-top-margin ${
                        tabList[0].current || tabList[1].current || tabList1[0].current || tabList1[1].current ? "" : "hidden"
                    }`}>
                        All fields with an asterisk (<span className="red">*</span>) are required
                    </p>
                </div>
            </div>

            <div className="standard-indent">
                <div>
                    <div className={`steps two-steps standard-top-margin ${userData.showAccountSharing ? "hidden" : ""}`}>
                        <ul className="disable-pointer">
                            <li 
                                id="breadcrumb-step1"
                                className={`${tabList[0].current ? "current" : ""} ${tabList[0].large ? "large" : ""}`}
                            >
                                <p>{tabList[0].displayLine1} {tabList[0].displayLine2}</p>
                            </li>
                            <li 
                                id="breadcrumb-step2"
                                className={`${tabList[1].current ? "current" : ""} ${tabList[1].large ? "large" : ""}`}
                            >
                                <p>{tabList[1].displayLine1} {tabList[1].displayLine2}</p>
                            </li>
                        </ul>
                    </div>
                    <div className={`steps two-steps standard-top-margin ${userData.showAccountSharing ? "" : "hidden"}`}>
                        <ul className="disable-pointer">
                            <li 
                                id="breadcrumb-step1"
                                className={`${tabList1[0].current ? "current" : ""} ${tabList1[0].large ? "large" : ""}`}
                            >
                                <p>{tabList1[0].displayLine1} {tabList1[0].displayLine2}</p>
                            </li>
                            <li 
                                id="breadcrumb-step2"
                                className={`${tabList1[1].current ? "current" : ""} ${tabList1[1].large ? "large" : ""}`}
                            >
                                <p>{tabList1[1].displayLine1} {tabList1[1].displayLine2}</p>
                            </li>
                            <li 
                                id="breadcrumb-step3"
                                className={`${tabList1[2].current ? "current" : ""} ${tabList1[2].large ? "large" : ""}`}
                            >
                                <p>{tabList1[2].displayLine1} {tabList1[2].displayLine2}</p>
                            </li>
                        </ul>
                    </div>
                </div>

                {(tabList[0].current || tabList1[0].current) && !step1Complete && (
                    <Step1 
                        tabList={tabList}
                        onSetUserData={handleSetUserData}
                        onUpdateStep={updateStep}
                    />
                )}

                {(tabList[1].current || tabList1[1].current) && !step2Complete && (
                    <Step2 
                        tabList={tabList}
                        userData={userData}
                        onSetNewData={handleSetNewData}
                        onUpdateStep={updateStep}
                    />
                )}

                {tabList1[2].current && step2Complete && (
                    <Step3 
                        tabList={tabList}
                        newData={newData}
                        userData={userData}
                    />
                )}
            </div>
        </div>
    );
}