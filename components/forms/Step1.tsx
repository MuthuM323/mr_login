'use client'

import React, { useState, useEffect } from 'react';
import { memberSplitService, VerifyUserRequest } from '@/services/memberSplitService';

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

interface Step1Props {
    tabList: TabItem[];
    onSetUserData: (data: UserData) => void;
    onUpdateStep: () => void;
}

interface IdOption {
    key: string;
    value: string;
}

const Step1: React.FC<Step1Props> = ({ onSetUserData, onUpdateStep }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [subscriberId, setSubscriberId] = useState('');
    const [zip, setZip] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [ssn, setSsn] = useState('');
    const [idType, setIdType] = useState('code');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [responseErrorMessage, setResponseErrorMessage] = useState('');
    const [showResponseErrorMessage, setShowResponseErrorMessage] = useState(false);
    const [showTips, setShowTips] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({});

    const idOptions: IdOption[] = [
        {
            key: "code",
            value: "Unique code from BCBSMS"
        },
        {
            key: "subID",
            value: "BCBSMS Subscriber ID"
        },
        {
            key: "ssn",
            value: "Last 4 digits of your SSN"
        },
    ];

    const dotCom = process.env.NEXT_PUBLIC_DOTCOM || 'https://www.bcbsms.com';
    const idCard = `${dotCom}/angular-apps/img/idcard.png`;

    // Show message logic (timestamp check)
    const [showMessage, setShowMessage] = useState(false);
    useEffect(() => {
        const currentTimestamp = Math.floor(new Date().getTime() / 1000.0);
        setShowMessage(currentTimestamp <= 1730419199);
    }, []);

    const clearIDs = () => {
        setSubscriberId('');
        setSsn('');
        setCode('');
        setErrors({});
    };

    const validateField = (field: string, value: string): string => {
        switch (field) {
            case 'firstName':
            case 'lastName':
                if (!value.trim()) return `${field === 'firstName' ? 'First' : 'Last'} name is required.`;
                if (!/^[A-Z'.-][ A-Z'.-]*$/i.test(value.trim())) {
                    return `${field === 'firstName' ? 'First' : 'Last'} name can only contain letters, spaces, dashes, and apostrophes.`;
                }
                return '';
            
            case 'birthDate':
                if (!value.trim()) return 'Date of birth is required.';
                if (value.length < 10) return 'Please enter date in the format of MM/DD/YYYY.';
                if (!/^(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])\/(19|20)\d{2}$/i.test(value)) {
                    return 'Please enter a valid date of birth.';
                }
                const year = parseInt(value.substring(6, 10));
                const currentYear = new Date().getFullYear();
                if (year > currentYear) return 'Please enter a valid date of birth.';
                return '';
            
            case 'zip':
                if (!value.trim()) return 'Zip code is required.';
                if (value.length < 5) return 'Zip code must be 5 digits.';
                return '';
            
            case 'subscriberId':
                if (idType !== 'subID') return '';
                if (!value.trim()) return 'Subscriber ID is required.';
                if (!/^[A-Z0-9]+$/i.test(value)) return 'Subscriber ID can only contain letters and numbers.';
                if (value.length < 10) return 'Subscriber ID must be at least 10 characters.';
                
                const firstChar = value.toLowerCase()[0];
                if (firstChar !== 'r') {
                    if (!/^[0-9]{9}[m]$/gi.test(value)) {
                        return 'Please enter a valid Subscriber ID format. Ex: 123456789M';
                    }
                } else {
                    if (!/^[r][0-9]{8}$/gi.test(value)) {
                        return 'Please enter a valid Subscriber ID format. Ex: 123456789M';
                    }
                }
                return '';
            
            case 'ssn':
                if (idType !== 'ssn') return '';
                if (!value.trim()) return 'Please enter the last 4 digits of your SSN.';
                if (!/^\d+$/.test(value)) return 'The last 4 digits of your SSN can only contain numbers.';
                if (value.length < 4) return 'Please enter the last 4 digits of your SSN.';
                return '';
            
            case 'code':
                if (idType !== 'code') return '';
                if (!value.trim()) return 'Unique Code is required.';
                if (!/^\d+$/.test(value)) return 'Unique Code can only contain numbers.';
                if (value.length < 7) return 'Unique Code must be 7 characters.';
                return '';
            
            default:
                return '';
        }
    };

    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};
        
        newErrors.firstName = validateField('firstName', firstName);
        newErrors.lastName = validateField('lastName', lastName);
        newErrors.birthDate = validateField('birthDate', birthDate);
        newErrors.zip = validateField('zip', zip);
        newErrors.subscriberId = validateField('subscriberId', subscriberId);
        newErrors.ssn = validateField('ssn', ssn);
        newErrors.code = validateField('code', code);

        // Remove empty errors
        Object.keys(newErrors).forEach(key => {
            if (!newErrors[key]) delete newErrors[key];
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: string, value: string) => {
        switch (field) {
            case 'firstName':
                setFirstName(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            case 'subscriberId':
                setSubscriberId(value);
                break;
            case 'zip':
                setZip(value);
                break;
            case 'birthDate':
                setBirthDate(value);
                break;
            case 'ssn':
                setSsn(value);
                break;
            case 'code':
                setCode(value);
                break;
        }

        // Clear error for this field when user starts typing
        if (errors[field]) {
            const newErrors = { ...errors };
            delete newErrors[field];
            setErrors(newErrors);
        }
    };

    const handleInputBlur = (field: string, value: string) => {
        setTouchedFields(prev => ({ ...prev, [field]: true }));
        
        // Validate field on blur (like Vue.js does)
        const error = validateField(field, value);
        if (error) {
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    const isFormValid = (): boolean => {
        // Check if all required fields are filled
        const requiredFields = ['firstName', 'lastName', 'birthDate', 'zip'];
        
        // Add the appropriate ID field based on idType
        if (idType === 'subID') {
            requiredFields.push('subscriberId');
        } else if (idType === 'ssn') {
            requiredFields.push('ssn');
        } else if (idType === 'code') {
            requiredFields.push('code');
        }

        // Check if all required fields have values
        for (const field of requiredFields) {
            let value = '';
            switch (field) {
                case 'firstName': value = firstName; break;
                case 'lastName': value = lastName; break;
                case 'birthDate': value = birthDate; break;
                case 'zip': value = zip; break;
                case 'subscriberId': value = subscriberId; break;
                case 'ssn': value = ssn; break;
                case 'code': value = code; break;
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
        
        return true;
    };

    const formatDate = (value: string): string => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');
        
        // Apply MM/DD/YYYY format
        if (digits.length >= 6) {
            return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
        } else if (digits.length >= 4) {
            return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
        } else if (digits.length >= 2) {
            return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        }
        return digits;
    };

    const formatZip = (value: string): string => {
        return value.replace(/\D/g, '').slice(0, 5);
    };

    const verifyUser = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setShowResponseErrorMessage(false);
        setResponseErrorMessage('');

        const sentData: VerifyUserRequest = {
            firstName: firstName.toUpperCase(),
            lastName: lastName.toUpperCase(),
            subscriberId: subscriberId.toUpperCase(),
            zipCode: zip,
            birthDate: birthDate,
            uniqueCode: code,
            ssn: ssn.replace(/-/g, ''),
        };

        try {
            const data = await memberSplitService.verifyUser(sentData);
            setLoading(false);
            
            if (data.status === "200") {
                onSetUserData(data.data);
                onUpdateStep();
            } else {
                setShowResponseErrorMessage(true);
                setResponseErrorMessage(data.message);
            }
        } catch (error: unknown) {
            setLoading(false);
            setShowResponseErrorMessage(true);
            
            const axiosError = error as { response?: { status: number } };
            if (axiosError.response?.status === 400 || axiosError.response?.status === 406) {
                setResponseErrorMessage("Could not find member with the information provided above.");
            } else if (axiosError.response?.status === 409) {
                setResponseErrorMessage("This user is already registered.");
            } else if (axiosError.response?.status === 410) {
                setResponseErrorMessage("This user's subscription has been terminated.");
            } else if (axiosError.response?.status === 412) {
                setResponseErrorMessage("This user's subscription is not in effect yet.");
            } else {
                setResponseErrorMessage("An error has occurred. Please try again later.");
            }
        }
    };

    return (
        <div>
            <div id="step1">
                <div>
                    <h4 className="standard-top-margin bold">Verify Your Identity</h4>

                    {showMessage && (
                        <p className="standard-top-margin temp-notification">
                            If your coverage effective date is between 9/1 and 9/30,
                            you should have received an email with login credentials.
                            Please use that information to login to your <i>my</i>Blue account.
                        </p>
                    )}

                    <p className="standard-top-margin id-selection">
                        <span className="flex-red">*</span>
                        Please select ID type then enter your corresponding identification information in the field below.
                        <span 
                            className="material-icons icon" 
                            onMouseEnter={() => setShowTips(true)}
                            onMouseLeave={() => setShowTips(false)}
                        >
                            info
                        </span>
                    </p>

                    <div style={{ position: 'relative' }}>
                        {showTips && (
                            <div className="modal">
                                <p className="bold">Unique Code from BCBSMS:</p>
                                <p className="standard-indent">
                                    Enter the unique code you received in the email or text message from Blue Cross & Blue Shield of Mississippi (BCBSMS).
                                </p>
                                <p className="bold standard-top-margin">Last 4 digits of your SSN:</p>
                                <p className="standard-indent">
                                    Enter the last four digits of your Social Security Number.
                                </p>
                                <p className="bold standard-top-margin">Subscriber ID:</p>
                                <p className="standard-indent">
                                    Enter the Subscriber ID from your BCBSMS ID Card.
                                </p>
                                <img className="sub-id-card" src={idCard} alt="Subscriber ID Card" />
                            </div>
                        )}
                    </div>

                    <select 
                        value={idType} 
                        onChange={(e) => {
                            setIdType(e.target.value);
                            clearIDs();
                        }}
                    >
                        {idOptions.map((option, index) => (
                            <option key={index} value={option.key}>
                                {option.value}
                            </option>
                        ))}
                    </select>

                    {idType === 'subID' && (
                        <div className="standard-top-margin">
                            <input
                                type="text"
                                name="subID"
                                id="subID"
                                value={subscriberId}
                                onChange={(e) => handleInputChange('subscriberId', e.target.value)}
                                onBlur={(e) => handleInputBlur('subscriberId', e.target.value)}
                                placeholder="123456789M"
                                maxLength={17}
                                className={errors.subscriberId && touchedFields.subscriberId ? 'invalid' : ''}
                            />
                            {errors.subscriberId && touchedFields.subscriberId && (
                                <div className="required displayError margin-top">
                                    <p className="red">{errors.subscriberId}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {idType === 'ssn' && (
                        <div className="standard-top-margin">
                            <input
                                type="password"
                                name="ssn"
                                id="ssn"
                                value={ssn}
                                onChange={(e) => handleInputChange('ssn', e.target.value)}
                                onBlur={(e) => handleInputBlur('ssn', e.target.value)}
                                maxLength={4}
                                className={errors.ssn && touchedFields.ssn ? 'invalid' : ''}
                            />
                            {errors.ssn && touchedFields.ssn && (
                                <div className="required displayError margin-top">
                                    <p className="red">{errors.ssn}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {idType === 'code' && (
                        <div className="standard-top-margin">
                            <input
                                type="text"
                                name="code"
                                id="code"
                                value={code}
                                onChange={(e) => handleInputChange('code', e.target.value)}
                                onBlur={(e) => handleInputBlur('code', e.target.value)}
                                maxLength={7}
                                className={errors.code && touchedFields.code ? 'invalid' : ''}
                            />
                            {errors.code && touchedFields.code && (
                                <div className="required displayError margin-top">
                                    <p className="red">{errors.code}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <hr className="standard-top-marginx2" />

                    <p className="standard-top-margin">
                        <span className="red">*</span>Your First Name (as registered with Blue Cross & Blue Shield of Mississippi)
                    </p>
                    <input
                        type="text"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        onBlur={(e) => handleInputBlur('firstName', e.target.value)}
                        maxLength={35}
                        className={errors.firstName && touchedFields.firstName ? 'invalid' : ''}
                    />
                    {errors.firstName && touchedFields.firstName && (
                        <div className="error-messages margin-top" role="alert">
                            <p className="red">{errors.firstName}</p>
                        </div>
                    )}

                    <p className="standard-top-margin">
                        <span className="red">*</span>Your Last Name (as registered with Blue Cross & Blue Shield of Mississippi)
                    </p>
                    <input
                        type="text"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        onBlur={(e) => handleInputBlur('lastName', e.target.value)}
                        maxLength={60}
                        className={errors.lastName && touchedFields.lastName ? 'invalid' : ''}
                    />
                    {errors.lastName && touchedFields.lastName && (
                        <div className="error-messages margin-top" role="alert">
                            <p className="red">{errors.lastName}</p>
                        </div>
                    )}

                    <p className="standard-top-margin">
                        <span className="red">*</span>Your Date of Birth
                    </p>
                    <input
                        type="text"
                        placeholder="MM/DD/YYYY"
                        name="birthDate"
                        value={birthDate}
                        onChange={(e) => {
                            const formatted = formatDate(e.target.value);
                            handleInputChange('birthDate', formatted);
                        }}
                        onBlur={(e) => handleInputBlur('birthDate', e.target.value)}
                        maxLength={10}
                        className={errors.birthDate && touchedFields.birthDate ? 'invalid' : ''}
                    />
                    {errors.birthDate && touchedFields.birthDate && (
                        <div className="required displayError margin-top">
                            <p className="red">{errors.birthDate}</p>
                        </div>
                    )}

                    <p className="standard-top-margin">
                        <span className="red">*</span>ZIP Code on file
                    </p>
                    <input
                        type="text"
                        id="zip-code"
                        name="zip"
                        value={zip}
                        onChange={(e) => handleInputChange('zip', formatZip(e.target.value))}
                        onBlur={(e) => handleInputBlur('zip', e.target.value)}
                        maxLength={5}
                        className={errors.zip && touchedFields.zip ? 'invalid' : ''}
                    />
                    {errors.zip && touchedFields.zip && (
                        <div className="required displayError margin-top">
                            <p className="red">{errors.zip}</p>
                        </div>
                    )}
                </div>

                <div className="standard-top-marginx2">
                    <button
                        className="submit standard-top-margin"
                        disabled={loading || !isFormValid()}
                        onClick={verifyUser}
                    >
                        CONTINUE
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
                .id-selection {
                    width: 50rem;
                }
                
                .temp-notification {
                    width: 47rem;
                }
                
                .icon {
                    cursor: pointer;
                    color: #07a2dd;
                    font-size: 16px;
                    font-weight: normal;
                    position: relative;
                }
                
                .modal {
                    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.24);
                    width: 30rem;
                    border-radius: 0.5rem;
                    z-index: 800;
                    position: absolute;
                    left: 23rem;
                    bottom: 3rem;
                    padding: 1rem;
                    font-size: 12px;
                    background: white;
                }
                
                .sub-id-card {
                    height: 11em;
                    width: 17em;
                    z-index: 1;
                }
                
                .flex-row {
                    display: flex;
                    flex-direction: row;
                }
                
                .flex-row.center {
                    align-items: center;
                }
                
                .horizontal-row {
                    display: flex;
                    flex-direction: row;
                    height: 3em;
                    overflow: visible;
                }
                
                .standard-top-marginx2 {
                    margin-top: 4rem;
                }
            `}</style>
        </div>
    );
};

export default Step1;