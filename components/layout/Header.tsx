import React from 'react';

const Header: React.FC = () => {
    const dotCom = process.env.NEXT_PUBLIC_DOTCOM || 'https://www.bcbsms.com';
    
    return (
        <header style={{ 
            display: 'block',
            width: '100%',
            padding: '10px 0',
            backgroundColor: '#fff',
            position: 'relative',
            zIndex: 1000,
            minHeight: '60px'
        }}>
            <a href={dotCom} style={{ 
                margin: '10px',
                display: 'inline-block'
            }}>
                <img 
                    src={`${dotCom}/angular-apps/img/bcbsms-logo.png`} 
                    alt="Blue Cross Blue Shield of Mississippi"
                    style={{
                        maxHeight: '40px',
                        width: 'auto',
                        display: 'block'
                    }}
                />
            </a>
        </header>
    );
};

export default Header;