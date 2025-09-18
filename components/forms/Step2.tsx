'use client'

import React, { useState, useEffect, useCallback } from 'react';
import BCBSMSPWCreation from './BCBSMSPWCreation';
import { memberSplitService, AccountSetupRequest, AuthTokens } from '@/services/memberSplitService';

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

interface SecurityQuestion {
    questionText: string;
}

interface Step2Props {
    tabList: TabItem[];
    userData: UserData;
    onSetNewData: (data: Partial<AuthTokens>) => void;
    onUpdateStep: () => void;
}

const Step2: React.FC<Step2Props> = ({ userData, onSetNewData, onUpdateStep }) => {
    const [terms, setTerms] = useState(false);
    const [verifiedEmail, setVerifiedEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [homeNumber, setHomeNumber] = useState('');
    const [selected1, setSelected1] = useState('');
    const [selected2, setSelected2] = useState('');
    const [selected3, setSelected3] = useState('');
    const [password, setPassword] = useState('');
    const [answer1, setAnswer1] = useState('');
    const [answer2, setAnswer2] = useState('');
    const [answer3, setAnswer3] = useState('');
    const [responseErrorMessage, setResponseErrorMessage] = useState('');
    const [options1, setOptions1] = useState<SecurityQuestion[]>([]);
    const [options2, setOptions2] = useState<SecurityQuestion[]>([]);
    const [options3, setOptions3] = useState<SecurityQuestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [desiredUsername, setDesiredUsername] = useState('');

    const [showResponseErrorMessage, setShowResponseErrorMessage] = useState(false);
    const [showDiv, setShowDiv] = useState(true);
    const [showExclamation, setShowExclamation] = useState(false);
    const [showCheck, setShowCheck] = useState(false);
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const dotCom = process.env.NEXT_PUBLIC_DOTCOM || 'https://www.bcbsms.com';

    const getSecurityQuestions = useCallback(async () => {
        if (!userData.requestToken || !userData.nonce) return;

        setLoading(true);
        setShowResponseErrorMessage(false);

        const sentData: AuthTokens = {
            sessionToken: userData.requestToken,
            nonce: userData.nonce
        };

        try {
            const data = await memberSplitService.getSecurityQuestions(sentData);
            setLoading(false);
            
            if (data.status === "200") {
                setOptions1(data.data.securityQuestions[0].questions);
                setOptions2(data.data.securityQuestions[1].questions);
                setOptions3(data.data.securityQuestions[2].questions);
            } else {
                setResponseErrorMessage(data.message);
            }
        } catch {
            setLoading(false);
            setShowResponseErrorMessage(true);
            setResponseErrorMessage("An error has occurred. Please try again later.");
        }
    }, [userData.requestToken, userData.nonce]);

    useEffect(() => {
        getSecurityQuestions();
        if (userData.username) {
            setDesiredUsername(userData.username);
        }
    }, [userData.username, getSecurityQuestions]);

    const validateField = (field: string, value: string): string => {
        switch (field) {
            case 'desiredUsername':
                if (!value.trim()) return 'Username is required.';
                if (value.length < 8) return 'Username should be at least 8 characters.';
                if (!/^[A-Z0-9]+$/i.test(value)) return 'Username should only contains numbers and letters.';
                return '';
            
            case 'email':
                if (!value.trim()) return 'Email is required.';
                if (!/^[A-Z0-9_@.-][ A-Z0-9_@.-]*$/i.test(value)) {
                    return 'Email can only contain letters, numbers, symbol (@), dots (.), hyphens (-), and underscore (_).';
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
                return '';
            
            case 'verifiedEmail':
                if (!value.trim()) return 'You must verify your email';
                if (value !== email) return 'Your emails must match';
                return '';
            
            case 'mobileNumber':
                if (!value.trim()) return 'Mobile phone number is required.';
                if (value.replace(/\D/g, '').length < 10) return 'Mobile phone number must be 10 characters.';
                return '';
            
            case 'homeNumber':
                if (value && value.replace(/\D/g, '').length < 10) return 'Home number must be 10 characters.';
                return '';
            
            case 'answer1':
            case 'answer2':
            case 'answer3':
                if (!value.trim()) return 'You must provide an answer.';
                return '';
            
            case 'terms':
                if (!terms) return 'Disclaimer must be accepted.';
                return '';
            
            default:
                return '';
        }
    };

    const validateSelections = (): string => {
        if (!selected1 || !selected2 || !selected3) {
            return 'You must select all security questions.';
        }
        return '';
    };

    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};
        
        newErrors.desiredUsername = validateField('desiredUsername', desiredUsername);
        newErrors.email = validateField('email', email);
        newErrors.verifiedEmail = validateField('verifiedEmail', verifiedEmail);
        newErrors.mobileNumber = validateField('mobileNumber', mobileNumber);
        newErrors.homeNumber = validateField('homeNumber', homeNumber);
        newErrors.answer1 = validateField('answer1', answer1);
        newErrors.answer2 = validateField('answer2', answer2);
        newErrors.answer3 = validateField('answer3', answer3);
        newErrors.terms = validateField('terms', '');
        newErrors.selections = validateSelections();

        // Remove empty errors
        Object.keys(newErrors).forEach(key => {
            if (!newErrors[key]) delete newErrors[key];
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: string, value: string) => {
        switch (field) {
            case 'desiredUsername':
                setDesiredUsername(value);
                setShowExclamation(false);
                setShowCheck(false);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'verifiedEmail':
                setVerifiedEmail(value);
                break;
            case 'mobileNumber':
                setMobileNumber(value);
                break;
            case 'homeNumber':
                setHomeNumber(value);
                break;
            case 'answer1':
                setAnswer1(value);
                break;
            case 'answer2':
                setAnswer2(value);
                break;
            case 'answer3':
                setAnswer3(value);
                break;
        }

        // Clear error for this field
        if (errors[field]) {
            const newErrors = { ...errors };
            delete newErrors[field];
            setErrors(newErrors);
        }
    };

    const formatPhoneNumber = (value: string): string => {
        const digits = value.replace(/\D/g, '');
        if (digits.length >= 6) {
            return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
        } else if (digits.length >= 3) {
            return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        }
        return digits;
    };

    const checkUsernameAvailability = async () => {
        if (!userData.requestToken || !userData.nonce) return;

        setShowResponseErrorMessage(false);

        const sentData = {
            userId: desiredUsername,
            sessionToken: userData.requestToken,
            nonce: userData.nonce
        };

        try {
            const data = await memberSplitService.checkUsernameAvailability(sentData);
            
            if (data.status === "200" && data.data === "OK") {
                setShowCheck(true);
                setShowExclamation(false);
                setupAccount();
            }
        } catch (error: unknown) {
            const axiosError = error as { response?: { status: number } };
            if (axiosError.response?.status === 409) {
                setShowCheck(false);
                setShowResponseErrorMessage(true);
                setResponseErrorMessage("Please enter a unique username");
                setShowExclamation(true);
            } else if (axiosError.response?.status === 500) {
                setShowCheck(false);
                setShowResponseErrorMessage(true);
                setResponseErrorMessage("An error has occurred. Please try again later.");
                setShowExclamation(true);
            } else {
                setShowCheck(false);
                setShowExclamation(true);
            }
        }
    };

    const preCheck = () => {
        if (userData.userExists) {
            setShowCheck(true);
            setShowExclamation(false);
            setupAccount();
        } else {
            checkUsernameAvailability();
        }
    };

    const setupAccount = async () => {
        if (!userData.requestToken || !userData.nonce) return;

        setLoading(true);
        setShowResponseErrorMessage(false);

        const sentData: AccountSetupRequest = {
            currentUsername: userData.username || "",
            username: desiredUsername,
            email: email,
            mobilePhone: mobileNumber,
            homePhone: homeNumber,
            password: password,
            securityQuestions: [
                {
                    question: selected1,
                    answer: answer1,
                },
                {
                    question: selected2,
                    answer: answer2,
                },
                {
                    question: selected3,
                    answer: answer3,
                }
            ],
        };

        const sentData2: AuthTokens = {
            sessionToken: userData.requestToken,
            nonce: userData.nonce
        };

        try {
            const data = await memberSplitService.accountSetup(sentData, sentData2);
            setLoading(false);
            
            if (data.status === "200") {
                if (userData.showAccountSharing === true) {
                    onSetNewData(data.data);
                    onUpdateStep();
                }
                if (userData.showAccountSharing === false) {
                    setShowDiv(false);
                }
            } else {
                setResponseErrorMessage(data.data.message);
            }
        } catch (error: unknown) {
            setLoading(false);
            setShowResponseErrorMessage(true);
            
            const axiosError = error as { response?: { status: number; data?: { message?: string } } };
            if (axiosError.response?.status === 400) {
                const message = axiosError.response.data?.message;
                if (message === "Cannot create user. User account already exists for SubID and MemberNumber") {
                    setResponseErrorMessage("Cannot create user. User account already exists.");
                } else if (message === "Invalid HomePhoneNumber") {
                    setResponseErrorMessage("Invalid home phone number");
                } else if (message === "Invalid Email") {
                    setResponseErrorMessage(message);
                } else if (message === "Email already Exists") {
                    setResponseErrorMessage("The email address you entered is already in use. <br> Please enter a unique email address and try again.");
                } else if (message === "Invalid CellPhoneNumber") {
                    setResponseErrorMessage("Invalid mobile phone number");
                } else if (message === "CellPhoneNumber already Exists") {
                    setResponseErrorMessage("The mobile phone number you entered is already in use. <br> Please enter a unique mobile phone number and try again.");
                } else if (message === "Security Answers should be unique") {
                    setResponseErrorMessage(message);
                } else {
                    setResponseErrorMessage("An error has occurred. Please try again later.");
                }
            } else {
                setResponseErrorMessage("An error has occurred. Please try again later.");
            }
        }
    };

    const isFormValid = (): boolean => {
        // Check if all required fields are filled and valid
        const requiredFields = [
            'desiredUsername', 'email', 'verifiedEmail', 'mobileNumber',
            'selected1', 'selected2', 'selected3', 'answer1', 'answer2', 'answer3'
        ];

        for (const field of requiredFields) {
            let value = '';
            switch (field) {
                case 'desiredUsername': value = desiredUsername; break;
                case 'email': value = email; break;
                case 'verifiedEmail': value = verifiedEmail; break;
                case 'mobileNumber': value = mobileNumber; break;
                case 'selected1': value = selected1; break;
                case 'selected2': value = selected2; break;
                case 'selected3': value = selected3; break;
                case 'answer1': value = answer1; break;
                case 'answer2': value = answer2; break;
                case 'answer3': value = answer3; break;
            }
            
            if (!value.trim()) {
                return false;
            }
            
            // Check if field has validation errors
            const error = validateField(field, value);
            if (error) {
                return false;
            }
        }
        
        // Check if password is valid
        if (!password) {
            return false;
        }
        
        // Check if terms are accepted
        if (!terms) {
            return false;
        }
        
        return true;
    };

    const handleContinue = () => {
        if (!validateForm()) return;
        preCheck();
    };

    return (
        <div>
            {showDiv ? (
                <div id="step2">
                    <div>
                        <h4 className="standard-top-margin">Step 2: Set Up Your Account</h4>
                    </div>
                    <div>
                        <p className="standard-top-margin">
                            <span className="red">*</span>Please create a username
                        </p>
                        <input
                            autoComplete="new-password"
                            type="text"
                            id="desiredUsername"
                            name="desiredUsername"
                            value={desiredUsername}
                            onChange={(e) => handleInputChange('desiredUsername', e.target.value)}
                            maxLength={20}
                            className={errors.desiredUsername || showExclamation ? 'invalid' : ''}
                        />
                        {showExclamation && <span className="material-icons red emphasis">close</span>}
                        {showCheck && <span className="material-icons green emphasis1">done</span>}

                        {showExclamation && (
                            <div className="required displayError margin-top">
                                <p className="red">Please enter a unique username and press continue.</p>
                            </div>
                        )}
                        {errors.desiredUsername && (
                            <div className="required displayError margin-top">
                                <p className="red">{errors.desiredUsername}</p>
                            </div>
                        )}

                        <div className="flexin standard-top-margin">
                            <div className="child-of-flex1">
                                <BCBSMSPWCreation onSetPassword={setPassword} />
                            </div>
                        </div>

                        <p className="standard-top-margin">
                            <span className="red">*</span>Please create an email address
                        </p>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            maxLength={70}
                            onContextMenu={(e) => e.preventDefault()}
                            onCopy={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                            className={errors.email ? 'invalid' : ''}
                        />
                        {errors.email && (
                            <div className="required displayError margin-top">
                                <p className="red">{errors.email}</p>
                            </div>
                        )}

                        <p className="standard-top-margin">
                            <span className="red">*</span>Please verify your email address
                        </p>
                        <input
                            type="text"
                            id="verifiedEmail"
                            name="verifiedEmail"
                            value={verifiedEmail}
                            onChange={(e) => handleInputChange('verifiedEmail', e.target.value)}
                            maxLength={70}
                            onContextMenu={(e) => e.preventDefault()}
                            onCopy={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                            className={errors.verifiedEmail ? 'invalid' : ''}
                        />
                        {errors.verifiedEmail && (
                            <div className="required displayError margin-top">
                                <p className="red">{errors.verifiedEmail}</p>
                            </div>
                        )}

                        <p className="standard-top-margin">
                            <span className="red">*</span>Please enter a mobile phone number
                            {userData.showAccountSharing && (
                                <span> (this <span style={{ textDecoration: 'underline' }}>cannot</span> be the same as{" "}
                                <b>{userData.policyHolderFirstName} {userData.policyHolderLastName}&apos;s</b>)</span>
                            )}
                        </p>
                        <input
                            type="text"
                            placeholder="123-456-7980"
                            id="mobileNumber"
                            name="mobileNumber"
                            value={mobileNumber}
                            onChange={(e) => handleInputChange('mobileNumber', formatPhoneNumber(e.target.value))}
                            maxLength={12}
                            className={errors.mobileNumber ? 'invalid' : ''}
                        />
                        {errors.mobileNumber && (
                            <div className="required displayError margin-top">
                                <p className="red">{errors.mobileNumber}</p>
                            </div>
                        )}

                        <p className="standard-top-margin">
                            Please enter a home phone number
                            {userData.showAccountSharing && (
                                <span> (this can be the same as{" "}
                                <b>{userData.policyHolderFirstName} {userData.policyHolderLastName}&apos;s</b>)</span>
                            )}
                        </p>
                        <input
                            type="text"
                            placeholder="123-456-7980"
                            id="homeNumber"
                            name="homeNumber"
                            value={homeNumber}
                            onChange={(e) => handleInputChange('homeNumber', formatPhoneNumber(e.target.value))}
                            maxLength={12}
                            className={errors.homeNumber ? 'invalid' : ''}
                        />
                        {errors.homeNumber && (
                            <div className="required displayError margin-top">
                                <p className="red">{errors.homeNumber}</p>
                            </div>
                        )}

                        <div>
                            <div className="standard-top-margin">
                                <p><span className="red">*</span>Security Question 1</p>
                                <select value={selected1} onChange={(e) => setSelected1(e.target.value)}>
                                    <option value="">Select a question</option>
                                    {options1.map((option, index) => (
                                        <option key={index} value={option.questionText}>
                                            {option.questionText}
                                        </option>
                                    ))}
                                </select>
                                <p className="standard-top-margin"><span className="red">*</span>Security Answer 1</p>
                                <input
                                    type="text"
                                    name="answer1"
                                    id="answer1"
                                    value={answer1}
                                    onChange={(e) => handleInputChange('answer1', e.target.value)}
                                    className={errors.answer1 ? 'invalid' : ''}
                                />
                                {errors.answer1 && (
                                    <div className="required displayError margin-top">
                                        <p className="red">{errors.answer1}</p>
                                    </div>
                                )}
                            </div>

                            <div className="standard-top-margin">
                                <p><span className="red">*</span>Security Question 2</p>
                                <select value={selected2} onChange={(e) => setSelected2(e.target.value)}>
                                    <option value="">Select a question</option>
                                    {options2.map((option, index) => (
                                        <option key={index} value={option.questionText}>
                                            {option.questionText}
                                        </option>
                                    ))}
                                </select>
                                <p className="standard-top-margin"><span className="red">*</span>Security Answer 2</p>
                                <input
                                    type="text"
                                    name="answer2"
                                    id="answer2"
                                    value={answer2}
                                    onChange={(e) => handleInputChange('answer2', e.target.value)}
                                    className={errors.answer2 ? 'invalid' : ''}
                                />
                                {errors.answer2 && (
                                    <div className="required displayError margin-top">
                                        <p className="red">{errors.answer2}</p>
                                    </div>
                                )}
                            </div>

                            <div className="standard-top-margin">
                                <p><span className="red">*</span>Security Question 3</p>
                                <select value={selected3} onChange={(e) => setSelected3(e.target.value)}>
                                    <option value="">Select a question</option>
                                    {options3.map((option, index) => (
                                        <option key={index} value={option.questionText}>
                                            {option.questionText}
                                        </option>
                                    ))}
                                </select>
                                <p className="standard-top-margin"><span className="red">*</span>Security Answer 3</p>
                                <input
                                    type="text"
                                    name="answer3"
                                    id="answer3"
                                    value={answer3}
                                    onChange={(e) => handleInputChange('answer3', e.target.value)}
                                    className={errors.answer3 ? 'invalid' : ''}
                                />
                                {errors.answer3 && (
                                    <div className="required displayError margin-top">
                                        <p className="red">{errors.answer3}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {errors.selections && (
                            <div className="required displayError margin-top">
                                <p className="red">{errors.selections}</p>
                            </div>
                        )}

                        <h4 className="standard-top-margin">Terms & Conditions</h4>
                        <p className="standard-top-margin">
                            You must read these{" "}
                            <a
                                href="/assets/terms&conditions.html"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Terms & Conditions
                            </a>{" "}
                            and select the Accept box before pressing Continue
                        </p>
                        <div className="h_iframe standard-top-margin" style={{ height: '300px' }}>
                            <iframe
                                src="/assets/terms&conditions.html"
                                frameBorder="0"
                                title="Terms and Conditions"
                            ></iframe>
                        </div>
                        <div className="standard-top-margin">
                            <input
                                className="checkbox"
                                type="checkbox"
                                checked={terms}
                                onChange={(e) => setTerms(e.target.checked)}
                                name="terms"
                                id="terms"
                            />{" "}
                            I have read and accept the Terms & Conditions
                        </div>
                        {errors.terms && (
                            <div className="required displayError margin-top">
                                <p className="red">{errors.terms}</p>
                            </div>
                        )}

                        <div className="standard-top-marginx2">
                            <button
                                className="submit standard-top-margin"
                                disabled={loading || !isFormValid()}
                                onClick={handleContinue}
                            >
                                CONTINUE
                            </button>

                            <div className="responseMessage" style={{ left: '3rem' }}>
                                {showResponseErrorMessage && (
                                    <div className="status-message error user-not-found">
                                        <p dangerouslySetInnerHTML={{ __html: responseErrorMessage }}></p>
                                        <span></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
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
                
                .emphasis {
                    top: 0.5rem;
                    position: relative;
                    vertical-align: middle;
                    font-weight: bold;
                }
                
                .emphasis1 {
                    position: relative;
                    vertical-align: middle;
                    bottom: 0.15rem;
                    font-weight: bold;
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

export default Step2;