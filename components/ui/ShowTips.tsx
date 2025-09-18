'use client'

import React, { useState } from 'react'; 
import TipsCard from '@/components/ui/TipsCard';

export default function ShowTips(){
    
    const [isHovered, setIsHovered] = useState(false);

    
    
    return(
    <>
        <button
            className="mx-1 my-2 bg-[#07a2dd] cursor-pointer text-[#fff] text-[12px] text-center relative rounded-full h-3 w-3"
            onMouseEnter={()=> setIsHovered(true)}
            onMouseLeave={()=> setIsHovered(false)}
        >
            i  
        </button>
        
        { isHovered && <TipsCard/> }
        
    </>
    );
}
