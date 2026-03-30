import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useGameStore();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password !== 'design@123') {
      setError('ACCESS DENIED: INVALID PASSWORD');
      return;
    }
    const success = login(username);
    if (!success) {
      setError('ACCESS DENIED: UNKNOWN USER ID');
    }
  };

  return (
    <div className="w-screen h-screen bg-bg-base overflow-hidden relative font-pixel text-text-primary flex items-center justify-center">
      <div className="scanlines"></div>
      
      <div className="bg-bg-wall-side border-4 border-accent-red p-8 z-10 pixel-shadow w-full max-w-md flex flex-col items-center">
        <h1 className="text-accent-red text-2xl mb-8 tracking-widest text-center focus:outline-none" style={{ textShadow: '2px 2px 0 #000' }}>
          GUILD SPACE<br/><span className="text-sm text-text-muted mt-2 block">TERMINAL LOGIN</span>
        </h1>
        
        {error && (
          <div className="bg-red-900/50 border-2 border-red-500 text-red-300 text-[10px] p-2 mb-6 w-full text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-accent-gold">IDENTIFICATION:</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black border-2 border-slate-600 p-3 text-white focus:outline-none focus:border-accent-gold"
              placeholder="E.g. Harshil, Twisha..."
              autoFocus
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-accent-gold">PASSCODE:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border-2 border-slate-600 p-3 text-white focus:outline-none focus:border-accent-gold"
            />
          </div>

          <button 
            type="submit" 
            className="mt-4 bg-accent-red hover:bg-red-500 text-white font-pixel p-4 border-b-4 border-r-4 border-black active:border-t-4 active:border-l-4 active:border-b-0 active:border-r-0 active:translate-y-[4px] active:translate-x-[4px] transition-all"
          >
            [ AUTHENTICATE ]
          </button>
        </form>

        <div className="mt-8 text-[8px] text-text-muted text-center w-full opacity-50">
          AUTHORIZED PERSONNEL ONLY<br/>
          (Harshil, Twisha, Meet, Shivansh)
        </div>
      </div>
    </div>
  );
}
