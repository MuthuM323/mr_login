import React from 'react';

interface ArrowCrumbsProps {
    pages: string[];
    step?: number;
}

export default function ArrowCrumbs( {pages, step = 0}: ArrowCrumbsProps) {
    const checkStatus = (index: number): string => {
        if(step === index) {
            return "bg-[#00a0df] flex flex-row text-white after:z-2 after:ml-[16rem] after:left after:absolute after:w-0 after:h-0 after:border-l-28 after:border-t-28 after:border-b-28 after:border-l-[#00a0df] after:border-t-transparent after:border-b-transparent after:border-r-transparent ";
        }
        if(index < step) {
            return "bg-[#c1e6f8] ";
        }
        if(index >= step) {
            return ("bg-[#bababa] ");
        }
        return '';
    };
    
    return (
        <section className="my-[32px] mx-[0px] block overflow-hidden shadow-[0_0px_12px_rgba(28, 85, 137, 0.25)]"> 
            <ul
                className="flex flex-row list-none my-[0px] px-[0px] [&_li]:text-center [&_li]:select-none"
            >
                {pages.map((page, index) => (
                    <li
                        key={index}
                        className={checkStatus(index)}
                    >
                        <p
                            className=" py-[16px] px-[16px] font-bold sm:w-3xs"
                        >{page}</p>    
                    </li>
                ))}
            </ul>
        </section>
    )
}