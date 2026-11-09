import type { Metadata } from 'next';
import './globals.css';
import { StoreHeader } from '@/components/store-header';
import { StoreFooter } from '@/components/store-footer';
export const metadata:Metadata={title:'Mustafa Dost FreshMart | Fresh groceries delivered',description:'Mustafa Dost FreshMart delivers fresh fruits, vegetables, pantry staples, dairy and daily essentials with care.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><StoreHeader/><main>{children}</main><StoreFooter/></body></html>}
