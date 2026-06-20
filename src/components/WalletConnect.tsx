import React, { useState, useEffect } from "react";
import { Wallet, ShieldCheck, Key, LogOut, ChevronRight } from "lucide-react";

export default function WalletConnect() {
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("0.00");
  const [status, setStatus] = useState<string>("disconnected");
  const [signature, setSignature] = useState<string>("");
  const [isSignLoading, setIsSignLoading] = useState<boolean>(false);
  const [hasProvider, setHasProvider] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      setHasProvider(true);
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window === "undefined") return;
    
    if ((window as any).ethereum) {
      try {
        setStatus("connecting");
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        setAccount(address);
        
        // Fetch balance
        const rawBalance = await (window as any).ethereum.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        });
        const wei = parseInt(rawBalance, 16);
        const eth = (wei / 1e18).toFixed(4);
        setBalance(eth);
        
        setStatus("connected");
        localStorage.setItem("wallet-connected", "true");
      } catch (err: any) {
        console.error(err);
        setStatus("error");
      }
    } else {
      // High fidelity mock wallet for user demo
      setStatus("connecting");
      setTimeout(() => {
        setAccount("0x6666...gemini");
        setBalance("1.3370");
        setStatus("connected");
        localStorage.setItem("wallet-connected", "true");
      }, 1200);
    }
  };

  const disconnectWallet = () => {
    setAccount("");
    setBalance("0.00");
    setStatus("disconnected");
    setSignature("");
    localStorage.removeItem("wallet-connected");
  };

  const signVerification = async () => {
    const msg = `[ai-core:no6] SIWE MQTT Proof:\nNonce: ${Math.floor(Math.random() * 1000000)}\nTimestamp: ${new Date().toISOString()}`;
    setIsSignLoading(true);
    
    if ((window as any).ethereum && account && !account.includes("gemini")) {
      try {
        const signatureHex = await (window as any).ethereum.request({
          method: "personal_sign",
          params: [msg, account],
        });
        setSignature(signatureHex);
      } catch (err) {
        console.error(err);
      }
    } else {
      // Mock sign
      setTimeout(() => {
        setSignature("0x3fca6d...77b7aa19c8f001c22ff7799d63c5a");
      }, 1000);
    }
    setIsSignLoading(false);
  };

  return (
    <div className="glass-card flex flex-col gap-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--theme-primary)] to-transparent opacity-10 rounded-full blur-md"></div>
      
      <div className="flex items-center gap-3">
        <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-lg text-[var(--theme-primary)]">
          <Wallet size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Web3 Integrator (Connect Wallet)</h3>
          <p className="text-xs text-[var(--theme-text-muted)]">Verified Web3 connectivity on Astro Islands</p>
        </div>
      </div>

      {status === "disconnected" && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-[var(--theme-text-muted)]">
            {hasProvider 
              ? "พบ Ethereum provider ในเบราว์เซอร์ของคุณ กดเชื่อมต่อเพื่อผูกบัญชีกระเป๋าจริง"
              : "ไม่พบกระเป๋าจริง (ระบบจะจำลองบัญชีให้สำหรับการทดสอบใช้งาน)"}
          </p>
          <button 
            onClick={connectWallet}
            className="flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-[var(--theme-gradient-from)] to-[var(--theme-gradient-to)] text-[var(--theme-btn-text)] text-xs font-semibold rounded-lg hover:opacity-90 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)] transition-all cursor-pointer"
          >
            Connect Wallet <ChevronRight size={14} />
          </button>
        </div>
      )}

      {status === "connecting" && (
        <div className="flex items-center justify-center py-4 gap-2">
          <div className="w-4 h-4 border-2 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-[var(--theme-text-muted)]">Connecting Wallet...</span>
        </div>
      )}

      {status === "connected" && (
        <div className="flex flex-col gap-3">
          <div className="p-2.5 bg-[var(--theme-surface-sub)] border border-[var(--theme-border-sub)] rounded-lg flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--theme-text-muted)] font-mono">Address:</span>
              <span className="font-mono text-[var(--theme-primary)]">{account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--theme-text-muted)] font-mono">Balance:</span>
              <span className="font-semibold font-mono text-[var(--theme-text)]">{balance} ETH</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={signVerification}
              disabled={isSignLoading}
              className="flex-grow flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[var(--theme-surface-sub)] hover:opacity-90 border border-[var(--theme-border-sub)] rounded-lg text-xs font-semibold text-[var(--theme-text)] active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)] transition-all cursor-pointer disabled:opacity-50"
            >
              <Key size={12} className="text-[var(--theme-primary)]" /> {isSignLoading ? "Signing..." : "Sign Msg Proof"}
            </button>
            <button 
              onClick={disconnectWallet}
              className="py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-500 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)] transition-all cursor-pointer"
              title="Disconnect"
            >
              <LogOut size={12} />
            </button>
          </div>

          {signature && (
            <div className="mt-1.5 p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <ShieldCheck size={12} /> Signature Signed
              </div>
              <p className="text-[10px] font-mono break-all text-emerald-500/80 leading-relaxed">
                {signature}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
