'use client';

import { Check, Share2 } from 'lucide-react';
import { useState } from 'react';

function getMobileUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://192.168.110.40:3000';

  if (typeof window === 'undefined') {
    return `${baseUrl}/shop`;
  }

  const { hostname, protocol, port, pathname } = window.location;
  const localHostNames = ['localhost', '127.0.0.1', '0.0.0.0'];

  if (localHostNames.includes(hostname)) {
    return `${baseUrl}${pathname || '/shop'}`;
  }

  return `${protocol}//${hostname}${port ? `:${port}` : ''}${pathname || '/shop'}`;
}

export function ShareShopLink() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = getMobileUrl();

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mustafa Dost FreshMart',
          text: 'Explore fresh groceries and daily essentials at Mustafa Dost FreshMart.',
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      } catch {
        setCopied(false);
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="btn btn-light"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        border: '1px solid #dfece4',
        boxShadow: '0 12px 26px rgba(23, 107, 69, 0.08)',
      }}
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {copied ? 'Link copied' : 'Share shop'}
    </button>
  );
}
