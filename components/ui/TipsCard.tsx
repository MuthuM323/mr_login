

import Image from 'next/image';
import idCard from '@/public/assets/idcard.png'

export default function TipsCard() {
    return( 
        <div className="">
            <div
                className="bg-white shadow-xl/30 w-[30rem] rounded-sm absolute p-[1rem] font-[12px]"
            >
                <p className="font-bold">Unique Code from BCBSMS:</p>
                <p className="mx-[2rem]">Enter the unique code you recieved in the email or text message from Blue Cross & Blue Shield of Mississippi (BCBSMS). </p>
                <p className="font-bold">Last 4 digits of your SSN:</p>
                <p className="mx-[2rem]">Enter the last four digits of your Social Security Number.</p>
                <p className="font-bold">Subscriber ID:</p>
                <p className="mx-[2rem]">Enter the Subscriber ID from your BCBSMS ID Card.</p>

                <Image 
                    className="z-1 h-[11em] w-[17em]" 
                    src={idCard}
                    alt="BCBSMS subscriber id card"    
                />
            </div>
        </div>
    )
}

