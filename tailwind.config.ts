import type { Config } from 'tailwindcss';
export default { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { forest:'#176B45', mint:'#EAF6EF', ink:'#183329' }, boxShadow:{ soft:'0 12px 35px rgba(22,70,45,.08)' } } }, plugins: [] } satisfies Config;
