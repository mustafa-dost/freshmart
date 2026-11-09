'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const router=useRouter();

  async function submit(e:React.FormEvent){
    e.preventDefault();
    setBusy(true);
    setError('');

    const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    const d=await r.json();
    setBusy(false);

    if(!r.ok){
      setError(d.error || 'Something went wrong. Please try again.');
      return;
    }

    router.push(d.role==='ADMIN'?'/admin':'/');
    router.refresh();
  }

  return <div className="container section" style={{maxWidth:520}}>
    <div className="card" style={{padding:34,borderRadius:28,boxShadow:'0 20px 50px rgba(23,107,69,0.08)',border:'1px solid #edf2ee'}}>
      <div style={{marginBottom:20}}>
        <span className="tag">Welcome back</span>
        <h1 style={{margin:'14px 0 10px',fontSize:36,letterSpacing:'-0.05em'}}>Sign in to Mustafa Dost FreshMart</h1>
        <p className="muted">Shop fresh produce, pantry essentials and family favourites with a faster, more secure checkout.</p>
      </div>

      <form onSubmit={submit} style={{display:'grid',gap:16}}>
        <label style={{display:'grid',gap:8,fontWeight:700}}>Email
          <input className="input" type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
        </label>

        <label style={{display:'grid',gap:8,fontWeight:700}}>Password
          <input className="input" type="password" required value={password} onChange={e=>setPassword(e.target.value)} />
        </label>

        {error && <p style={{color:'#b42318',margin:0}}>{error}</p>}

        <button disabled={busy} className="btn btn-primary" style={{marginTop:8}}>{busy ? 'Signing in...' : 'Login'}</button>
      </form>

      <p className="muted" style={{marginTop:18}}>New to the store? <Link href="/register" style={{color:'#176b45',fontWeight:700}}>Create an account</Link></p>
    </div>
  </div>
}
