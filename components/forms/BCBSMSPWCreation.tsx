'use client'

import React, { useState, useEffect } from 'react';

interface BCBSMSPWCreationProps {
    onSetPassword: (password: string) => void;
}

interface PasswordValidation {
    minLength: boolean;
    lowerCase: boolean;
    upperCase: boolean;
    number: boolean;
    specialChar: boolean;
}

const BCBSMSPWCreation: React.FC<BCBSMSPWCreationProps> = ({ onSetPassword }) => {
    const [password, setPassword] = useState('');
    const [passwordVerification, setPasswordVerification] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [validation, setValidation] = useState<PasswordValidation>({
        minLength: false,
        lowerCase: false,
        upperCase: false,
        number: false,
        specialChar: false
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({});

    const validatePassword = (pwd: string): PasswordValidation => {
        return {
            minLength: pwd.length >= 8,
            lowerCase: /[a-z]/.test(pwd),
            upperCase: /[A-Z]/.test(pwd),
            number: /[0-9]/.test(pwd),
            specialChar: /[^A-Za-z0-9]/.test(pwd)
        };
    };

    const isPasswordValid = (validation: PasswordValidation): boolean => {
        return Object.values(validation).every(Boolean);
    };

    const getPasswordStrength = (): string => {
        if (!password) return 'Weak';
        const isValid = isPasswordValid(validation);
        if (!isValid) return 'Weak';
        if (password.length < 12) return 'Moderate';
        return 'Strong';
    };

    const getStrengthClass = (): string => {
        const strength = getPasswordStrength();
        if (strength === 'Moderate') return 'acceptable';
        if (strength === 'Strong') return 'strong';
        return '';
    };

    useEffect(() => {
        const newValidation = validatePassword(password);
        setValidation(newValidation);

        // Emit password to parent
        if (isPasswordValid(newValidation) && password === passwordVerification) {
            onSetPassword(password);
        } else {
            onSetPassword('');
        }
    }, [password, passwordVerification, onSetPassword]);

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        
        // Clear password verification error if passwords now match
        if (errors.passwordVerification && value === passwordVerification) {
            const newErrors = { ...errors };
            delete newErrors.passwordVerification;
            setErrors(newErrors);
        }
    };

    const handlePasswordVerificationChange = (value: string) => {
        setPasswordVerification(value);
        setTouchedFields(prev => ({ ...prev, passwordVerification: true }));
        
        // Validate password match
        if (touchedFields.passwordVerification || value) {
            if (value !== password) {
                setErrors(prev => ({ ...prev, passwordVerification: 'Passwords must match' }));
            } else {
                const newErrors = { ...errors };
                delete newErrors.passwordVerification;
                setErrors(newErrors);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex-div">
            <p>
                <span className="red">*</span>Please create a password
            </p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    autoComplete="new-password"
                    type={showPassword ? "text" : "password"}
                    className={isPasswordValid(validation) ? "valid-input" : (password ? "invalid" : "")}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    maxLength={32}
                    onContextMenu={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                />
                <span 
                    className="material-icons small toggle-password space-left"
                    onClick={togglePasswordVisibility}
                >
                    {showPassword ? 'visibility_on' : 'visibility_off'}
                </span>
            </div>
            
            <div className="flex-row">
                <div className={`strength-meter ${getStrengthClass()}`}></div>
                <p>{getPasswordStrength()}</p>
            </div>
            
            <div className={`password-req ${isPasswordValid(validation) ? 'all-valid' : ''}`}>
                <ul>
                    <li className={validation.lowerCase ? 'valid' : ''}>
                        <div className="flex-row">
                            <span className="material-icons bottom">
                                {validation.lowerCase ? 'done' : 'close'}
                            </span>
                            <p className="center-text">Password must contain a lowercase letter.</p>
                        </div>
                    </li>
                    <li className={validation.upperCase ? 'valid' : ''}>
                        <div className="flex-row">
                            <span className="material-icons bottom">
                                {validation.upperCase ? 'done' : 'close'}
                            </span>
                            <p className="center-text">Password must contain an uppercase letter.</p>
                        </div>
                    </li>
                    <li className={validation.number ? 'valid' : ''}>
                        <div className="flex-row">
                            <span className="material-icons bottom">
                                {validation.number ? 'done' : 'close'}
                            </span>
                            <p className="center-text">Password must contain a number.</p>
                        </div>
                    </li>
                    <li className={validation.specialChar ? 'valid' : ''}>
                        <div className="flex-row">
                            <span className="material-icons bottom">
                                {validation.specialChar ? 'done' : 'close'}
                            </span>
                            <p className="center-text">Password must contain a special character (!#@&$*%).</p>
                        </div>
                    </li>
                    <li className={validation.minLength ? 'valid' : ''}>
                        <div className="flex-row">
                            <span className="material-icons bottom">
                                {validation.minLength ? 'done' : 'close'}
                            </span>
                            <p className="center-text">Password must be at least 8 characters long.</p>
                        </div>
                    </li>
                </ul>
            </div>
            
            <p className="standard-top-margin">
                <span className="red">*</span>Please verify your password
            </p>
            <input
                type="password"
                className={!errors.passwordVerification && passwordVerification && password === passwordVerification ? "valid-input" : (errors.passwordVerification ? "invalid" : "")}
                id="passwordVerification"
                name="passwordVerification"
                value={passwordVerification}
                onChange={(e) => handlePasswordVerificationChange(e.target.value)}
                maxLength={32}
                onContextMenu={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                autoComplete="off"
            />
            {errors.passwordVerification && (
                <div className="required displayError margin-top">
                    <p className="red">{errors.passwordVerification}</p>
                </div>
            )}

            <style jsx>{`
                .flex-row {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                
                .flex-div {
                    display: flex;
                    flex-direction: column;
                }
                
                .flex-div input {
                    width: 20rem;
                }
                
                .strength-meter {
                    border: 7px solid #e4002b;
                    height: 0;
                    margin-top: 0.5rem;
                    margin-right: 0.5rem;
                    width: 3rem;
                    border-radius: 7px;
                    background-color: #e4002b;
                }
                
                .acceptable {
                    border: 7px solid #009EDC;
                    width: 6.75rem;
                    background-color: #009EDC;
                }
                
                .strong {
                    border: 7px solid #6e9e00;
                    width: 12.5rem;
                    background-color: #6e9e00;
                }
                
                .bottom {
                    vertical-align: bottom;
                }
                
                .center-text {
                    position: relative;
                    margin-top: 1.3px;
                }
                
                .password-req ul {
                    list-style: none;
                    padding: 0;
                }
                
                .password-req li {
                    margin: 5px 0;
                }
                
                .password-req .valid {
                    color: #6e9e00;
                }
                
                .all-valid {
                    color: #6e9e00;
                }
            `}</style>
        </div>
    );
};

export default BCBSMSPWCreation;