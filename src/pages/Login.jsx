cat > src/pages/Login.jsx << 'EOF'
import React, { useState } from 'react';
import { supabase } from '@/api/supabaseClient';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async () => {
    setLoading(true); setError(''); setMessage('');
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = '/#/';
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Compte créé ! Vérifiez votre email.');
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0f172a'}}>
      <div style={{width:'100%',maxWidth:'400px',background:'#1e293b',borderRadius:'16px',padding:'32px'}}>
        <h1 style={{color:'white',textAlign:'center',marginBottom:'32px',fontSize:'24px'}}>Online Career Manager</h1>
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{padding:'12px',borderRadius:'8px',background:'#334155',color:'white',border:'1px solid #475569'}} />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe" style={{padding:'12px',borderRadius:'8px',background:'#334155',color:'white',border:'1px solid #475569'}} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} />
          {error && <p style={{color:'#f87171',fontSize:'14px'}}>{error}</p>}
          {message && <p style={{color:'#4ade80',fontSize:'14px'}}>{message}</p>}
          <button onClick={handleSubmit} disabled={loading} style={{padding:'12px',background:'#2563eb',color:'white',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'16px'}}>{loading?'Chargement...':isLogin?'Se connecter':"S'inscrire"}</button>
          <button onClick={()=>{setIsLogin(!isLogin);setError('');setMessage('');}} style={{background:'none',border:'none',color:'#94a3b8',cursor:'pointer',fontSize:'14px'}}>{isLogin?"Pas de compte ? S'inscrire":'Déjà un compte ? Se connecter'}</button>
        </div>
      </div>
    </div>
  );
}
EOF
