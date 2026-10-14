import React from 'react';
import Link from 'next/link';

interface Navs{
    slug: string
    title: string
    url: string
    scrapable: boolean
}

const NavLinks = async () => {

const res = await fetch('https://news-api-v2.vercel.app/api/categories');
const data = await res.json();
const navs: Navs[] = data.data
const filterNavs = navs.filter(n=> n.scrapable)

    return (
        <div className='flex gap-5 justify-center '>

            <Link href={'/'}>হোম</Link>

            {
                filterNavs.map((n, i)=> <Link href={`/category/${n.slug}`} key={i} > {n.title}</Link>)
            }
        </div>
    );
};

export default NavLinks;