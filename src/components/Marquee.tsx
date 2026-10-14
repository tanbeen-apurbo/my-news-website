

import MarqueeText from "react-marquee-text"
import "react-marquee-text/dist/styles.css"
import React from 'react';
import Link from "next/link";
interface Headlines {
    id: string
    title: string
}
const Marquee = async() => {
const res = await fetch('https://news-api-v2.vercel.app/api/news?limit=10')
const data = await res.json();
const headlines:Headlines[] = data.data
console.log(headlines)

    return (
        
        
        <div className="bg-red-600 text-white p-1 mt-3 ">
            <div className="flex max-w-7xl mx-auto">
                <div className="bg-red-700 py-1 px-5 font-bold">সর্বশেষ</div>
            <MarqueeText className="py-1" direction="right" duration={10}>
                {
                headlines.map((h, i)=> <Link key={i} href={`/news/${h.id}`}>
                <span key={h.id}><span key={i}>{h.title}</span>
            <span className='mx-5'>•</span></span></Link> )
            }
            </MarqueeText>
            </div>
        </div>
        
        
    );
};

export default Marquee;