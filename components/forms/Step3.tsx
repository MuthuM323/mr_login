'use client'

import React, { useState } from 'react';
import { memberSplitService, AccountSharingRequest, AuthTokens } from '@/services/memberSplitService';

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

interface Step3Props {
    tabList: TabItem[];
    newData: Partial<AuthTokens>;
    userData: UserData;
}

const Step3: React.FC<Step3Props> = ({ newData, userData }) => {
    const [allow, setAllow] = useState(false);
    const [deny, setDeny] = useState(false);
    const [responseErrorMessage, setResponseErrorMessage] = useState('');
    const [showResponseErrorMessage, setShowResponseErrorMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDiv, setShowDiv] = useState(true);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const dotCom = process.env.NEXT_PUBLIC_DOTCOM || 'https://www.bcbsms.com';

    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};
        
        if (!allow && !deny) {
            newErrors.selection = 'You must make a selection above.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAllowChange = (checked: boolean) => {
        setAllow(checked);
        if (checked) {
            setDeny(false);
        }
        
        // Clear error
        if (errors.selection) {
            const newErrors = { ...errors };
            delete newErrors.selection;
            setErrors(newErrors);
        }
    };

    const handleDenyChange = (checked: boolean) => {
        setDeny(checked);
        if (checked) {
            setAllow(false);
        }
        
        // Clear error
        if (errors.selection) {
            const newErrors = { ...errors };
            delete newErrors.selection;
            setErrors(newErrors);
        }
    };

    const accountSharing = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setShowResponseErrorMessage(false);

        const sentData: AccountSharingRequest = {
            shareAccount: allow,
        };

        const sentData2: AuthTokens = {
            sessionToken: newData.sessionToken || '',
            nonce: newData.nonce || ''
        };

        try {
            const data = await memberSplitService.accountSharing(sentData, sentData2);
            setLoading(false);
            
            if (data.status === "200") {
                setShowDiv(false);
            } else {
                setResponseErrorMessage(data.message);
                setShowResponseErrorMessage(true);
            }
        } catch {
            setLoading(false);
            setShowResponseErrorMessage(true);
            setResponseErrorMessage("An error has occurred. Please try again later.");
        }
    };

    return (
        <div>
            <div>
                <h4 className="standard-top-margin">Step 3: Account Sharing</h4>
            </div>
            <div>
                <p className="standard-top-margin">
                    You have the ability to link your <span className="italic">my</span>Blue account with the other Members with the
                    same Subscriber ID.
                    This allows those Members the option to see the Your Benefits, Your Claims, Your Rx, and Your Health
                    information.
                    You can grant or revoke this access at any time by logging into www.bcbsms.com. Please note that choosing not to
                    share access to your <span className="italic">my</span>Blue account does not prevent the Subscriber from receiving
                    an Explanation of Benefits or
                    a Claims Itemization regarding claims for services you receive from a Provider.
                </p>
                <p className="standard-top-margin">
                    Because you are a dependent on their benefit plan, you will have the option to link your health information with{" "}
                    {userData.policyHolderFirstName} {userData.policyHolderLastName}.
                    Please choose whether to grant permission to share access to your <span className="italic">my</span>Blue account,
                    which includes health information about you,
                    with {userData.policyHolderFirstName} {userData.policyHolderLastName} by checking the appropriate box below.
                </p>
                
                {showDiv ? (
                    <div id="step2">
                        <div className="standard-top-margin">
                            <div>
                                <input
                                    className="checkbox child-of-flex1"
                                    type="checkbox"
                                    checked={allow}
                                    onChange={(e) => handleAllowChange(e.target.checked)}
                                    name="allow"
                                    id="allow"
                                />{" "}
                                <span className="bold">
                                    I allow my health information to be shared with{" "}
                                    {userData.policyHolderFirstName} {userData.policyHolderLastName}
                                </span>
                            </div>
                            <div>
                                <input
                                    className="checkbox"
                                    type="checkbox"
                                    checked={deny}
                                    onChange={(e) => handleDenyChange(e.target.checked)}
                                    name="deny"
                                    id="deny"
                                />{" "}
                                <span className="bold">
                                    I DO NOT allow my health information to be shared with{" "}
                                    {userData.policyHolderFirstName} {userData.policyHolderLastName}
                                </span>
                            </div>
                        </div>
                        
                        {errors.selection && (
                            <div className="required displayError margin-top">
                                <p className="red">{errors.selection}</p>
                            </div>
                        )}
                    </div>
                ) : null}
                
                <div>
                    <button
                        className="submit"
                        disabled={loading || !showDiv}
                        onClick={accountSharing}
                    >
                        COMPLETE MY ACCOUNT
                    </button>
                    <div className="responseMessage" style={{ left: '3rem' }}>
                        {showResponseErrorMessage && (
                            <div className="status-message error user-not-found">
                                <p>{responseErrorMessage}</p>
                                <span></span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {!showDiv && (
                <div className="resize">
                    <div className="status-message success user-not-found">
                        <p>
                            Your <i style={{ fontStyle: 'italic' }}>my</i>Blue Member Account is now complete.
                            Please go to <a href={dotCom}>BCBSMS.com</a> and login with your username and password.
                        </p>
                        <span></span>
                    </div>
                </div>
            )}

            {loading && (
                <>
                    <div className="message-overlay" />
                    <div className="loading-container">
                        <div id="floatingCirclesG">
                            <div className="f_circleG" id="frotateG_01"></div>
                            <div className="f_circleG" id="frotateG_02"></div>
                            <div className="f_circleG" id="frotateG_03"></div>
                            <div className="f_circleG" id="frotateG_04"></div>
                            <div className="f_circleG" id="frotateG_05"></div>
                            <div className="f_circleG" id="frotateG_06"></div>
                            <div className="f_circleG" id="frotateG_07"></div>
                            <div className="f_circleG" id="frotateG_08"></div>
                        </div>
                        <p>Loading</p>
                    </div>
                </>
            )}

            <style jsx>{`
                .flexin {
                    display: flex;
                }
                
                .child-of-flex1 {
                    flex: 1;
                }
                
                .resize {
                    width: 43rem;
                    bottom: 2rem;
                    position: relative;
                }
            `}</style>
        </div>
    );
};

export default Step3;