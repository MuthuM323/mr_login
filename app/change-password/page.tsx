'use client'

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { memberSplitService, ChangePasswordRequest } from '@/services/memberSplitService';

const ChangePasswordPage: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [showResponseMessage, setShowResponseMessage] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const validateField = (field: string, value: string): string => {
        switch (field) {
            case 'currentPassword':
                if (!value.trim()) return 'Current password is required.';
                return '';
            
            case 'newPassword':
                if (!value.trim()) return 'New password is required.';
                if (value.length < 8) return 'Password must be at least 8 characters long.';
                if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter.';
                if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter.';
                if (!/[0-9]/.test(value)) return 'Password must contain a number.';
                if (!/[^A-Za-z0-9]/.test(value)) return 'Password must contain a special character.';
                return '';
            
            case 'confirmPassword':
                if (!value.trim()) return 'Please confirm your new password.';
                if (value !== newPassword) return 'Passwords do not match.';
                return '';
            
            default:
                return '';
        }
    };

    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};
        
        newErrors.currentPassword = validateField('currentPassword', currentPassword);
        newErrors.newPassword = validateField('newPassword', newPassword);
        newErrors.confirmPassword = validateField('confirmPassword', confirmPassword);

        // Remove empty errors
        Object.keys(newErrors).forEach(key => {
            if (!newErrors[key]) delete newErrors[key];
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: string, value: string) => {
        switch (field) {
            case 'currentPassword':
                setCurrentPassword(value);
                break;
            case 'newPassword':
                setNewPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
        }

        // Clear error for this field
        if (errors[field]) {
            const newErrors = { ...errors };
            delete newErrors[field];
            setErrors(newErrors);
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setShowResponseMessage(false);
        setResponseMessage('');

        const requestData: ChangePasswordRequest = {
            currentPassword: currentPassword,
            newPassword: newPassword
        };

        // For this example, we'll need a token - in a real app this would come from authentication
        const token = 'your-auth-token'; // This should come from your auth system

        try {
            const data = await memberSplitService.changePassword(token, requestData);
            setLoading(false);
            
            if (data.status === "200") {
                setIsSuccess(true);
                setResponseMessage("Your password has been successfully changed.");
                setShowResponseMessage(true);
                
                // Clear form
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setIsSuccess(false);
                setResponseMessage(data.message || "An error occurred while changing your password.");
                setShowResponseMessage(true);
            }
        } catch (error: unknown) {
            setLoading(false);
            setIsSuccess(false);
            
            const axiosError = error as { response?: { status: number } };
            if (axiosError.response?.status === 400) {
                setResponseMessage("Invalid current password.");
            } else if (axiosError.response?.status === 401) {
                setResponseMessage("You are not authorized to perform this action.");
            } else {
                setResponseMessage("An error has occurred. Please try again later.");
            }
            setShowResponseMessage(true);
        }
    };

    return (
        <div>
            <Header />
            <hr className="bluebar" />
            <div className="standard-indent">
                <div>
                    <h4 className="standard-top-margin">Change Password</h4>
                    <p className="standard-top-margin">
                        All fields with an asterisk (<span className="red">*</span>) are required
                    </p>
                </div>

                <div className="standard-top-margin">
                    <p className="standard-top-margin">
                        <span className="red">*</span>Current Password
                    </p>
                    <input
                        type="password"
                        name="currentPassword"
                        value={currentPassword}
                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                        maxLength={32}
                    />
                    {errors.currentPassword && (
                        <div className="error-messages margin-top" role="alert">
                            <p className="red">{errors.currentPassword}</p>
                        </div>
                    )}

                    <p className="standard-top-margin">
                        <span className="red">*</span>New Password
                    </p>
                    <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        maxLength={32}
                    />
                    {errors.newPassword && (
                        <div className="error-messages margin-top" role="alert">
                            <p className="red">{errors.newPassword}</p>
                        </div>
                    )}

                    <p className="standard-top-margin">
                        <span className="red">*</span>Confirm New Password
                    </p>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        maxLength={32}
                    />
                    {errors.confirmPassword && (
                        <div className="error-messages margin-top" role="alert">
                            <p className="red">{errors.confirmPassword}</p>
                        </div>
                    )}
                </div>

                <div>
                    <button
                        className="submit standard-top-margin"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        CHANGE PASSWORD
                    </button>
                    
                    <div className="responseMessage" style={{ left: '3rem' }}>
                        {showResponseMessage && (
                            <div className={`status-message ${isSuccess ? 'success' : 'error'} user-not-found`}>
                                <p>{responseMessage}</p>
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
        </div>
    );
};

export default ChangePasswordPage;