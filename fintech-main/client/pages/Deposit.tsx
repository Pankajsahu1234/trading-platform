// import { useState, useEffect } from "react";
// import { GlassCard } from "@/components/common/GlassCard";
// import { Wallet, Copy, Check, AlertCircle, CheckCircle, QrCode } from "lucide-react";
// import { apiClient } from "@/services/api";
// import { useAuth } from "@/context/AuthContext";

// interface DepositAddressResponse {
//   success: boolean;
//   network: string;
//   depositAddress: string;
// }

// interface DepositSubmitResponse {
//   success: boolean;
// }

// export default function Deposit() {
//   const { user } = useAuth();
//   const [amount, setAmount] = useState("");
//   const [txHash, setTxHash] = useState("");
//   const [screenshot, setScreenshot] = useState<File | null>(null);
//   const [senderAddress, setSenderAddress] = useState("");
//   const [depositAddress, setDepositAddress] = useState<string>('');
//   const [network, setNetwork] = useState<string>("TRC20");
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [step, setStep] = useState<1 | 2>(1); // Step 1: View address, Step 2: Submit TX

//   useEffect(() => {
//     fetchDepositAddress();
//   }, []);

//   const fetchDepositAddress = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get<DepositAddressResponse>("/admin/depositeAddress");
//       console.log("Deposit Address Response:", response.data);
//       setDepositAddress(response.data.depositAddress);
//       const data = response.data as DepositAddressResponse;
      
//       if (data.success) {
//         // setDepositAddress(data.address);
//         setNetwork(data.network);
//       }
//     } catch (err: any) {
//       setError(err?.message || "Failed to load deposit address");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopyAddress = () => {
//     if (depositAddress) {
//       navigator.clipboard.writeText(depositAddress);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file type
//       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//       if (!validTypes.includes(file.type)) {
//         setError('Please select a valid image file (JPEG, PNG, or WebP)');
//         e.target.value = '';
//         return;
//       }
      
//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         setError('Image size should not exceed 5MB');
//         e.target.value = '';
//         return;
//       }
      
//       setScreenshot(file);
//       setError(null);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);
    
//     if (!amount || parseFloat(amount) < 10) {
//       setError("Minimum deposit amount is $10 USDT");
//       return;
//     }

//     if (!txHash || txHash.length < 60) {
//       setError("Please enter a valid transaction hash");
//       return;
//     }

//     if (!senderAddress || senderAddress.length !== 34) {
//       setError("Please enter the sending address (34 characters)");
//       return;
//     }

//     if (!screenshot) {
//       setError("Please upload a transaction screenshot");
//       return;
//     }

//     try {
//       setSubmitting(true);
      
//       // Get token from localStorage
//       const token = localStorage.getItem('auth_token');
//       if (!token) {
//         setError("Authentication required. Please login again.");
//         return;
//       }

//       // Create FormData
//       const formData = new FormData();
//       formData.append('tx_hash', txHash);
//       formData.append('amount', amount);
//       formData.append('sender_address', senderAddress);
//       formData.append('screenshot', screenshot);

//       // Send request with FormData
//       const response = await apiClient.post<DepositSubmitResponse>("/deposit/submit", formData, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.data.success) {
//         setSuccess("Deposit submitted successfully! Your transaction will be verified within 15-30 minutes.");
//         setAmount("");
//         setTxHash("");
//         setSenderAddress("");
//         setScreenshot(null);
//         setStep(1);
        
//         // Reset file input
//         const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
//         if (fileInput) fileInput.value = '';
        
//         // Reset form after 5 seconds
//         setTimeout(() => {
//           setSuccess(null);
//         }, 5000);
//       }
//     } catch (err: any) {
//       setError(err?.message || "Failed to submit deposit");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <main className="p-4 lg:p-8 lg:ml-64 min-h-screen">
//       <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
//         <div>
//           <h1 className="text-3xl font-bold mb-2">Deposit USDT</h1>
//           <p className="text-muted-foreground">
//             Deposit USDT (TRC20) to your account
//           </p>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <GlassCard heavy className="p-8 text-center">
//             <div className="animate-spin mb-4 mx-auto w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
//             <p className="text-muted-foreground">Loading deposit address...</p>
//           </GlassCard>
//         )}

//         {/* Error State */}
//         {error && (
//           <div className="bg-loss/20 border border-loss/30 text-loss px-4 py-3 rounded-lg flex items-center gap-2">
//             <AlertCircle size={20} />
//             <span>{error}</span>
//           </div>
//         )}

//         {/* Success State */}
//         {success && (
//           <div className="bg-profit/20 border border-profit/30 text-profit px-4 py-3 rounded-lg flex items-center gap-2">
//             <CheckCircle size={20} />
//             <span>{success}</span>
//           </div>
//         )}

//         {/* Main Content */}
//         {!loading && depositAddress && (
//           <>
//             {/* Step Indicator */}
//             <div className="flex items-center justify-center gap-4 mb-6">
//               <div className={`flex items-center gap-2 ${step === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
//                   step === 1 ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
//                 }`}>
//                   1
//                 </div>
//                 <span className="text-sm font-semibold hidden sm:inline">Deposit Address</span>
//               </div>
              
//               <div className="h-px w-12 bg-border"></div>
              
//               <div className={`flex items-center gap-2 ${step === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
//                   step === 2 ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
//                 }`}>
//                   2
//                 </div>
//                 <span className="text-sm font-semibold hidden sm:inline">Submit Transaction</span>
//               </div>
//             </div>

//             {/* Step 1: Deposit Address */}
//             {step === 1 && (
//               <GlassCard heavy className="p-8 space-y-6">
//                 <div className="text-center">
//                   <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Wallet className="text-primary" size={32} />
//                   </div>
//                   <h2 className="text-2xl font-bold mb-2">Your Deposit Address</h2>
//                   <p className="text-sm text-muted-foreground">
//                     Send USDT (TRC-20) to this address
//                   </p>
//                 </div>

//                 {/* Network Badge */}
//                 <div className="flex justify-center">
//                   <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-semibold">
//                     Network: TRON
//                   </span>
//                 </div>

//                 {/* QR Code */}
//                 <div className="flex justify-center p-6 bg-white rounded-lg">
//                   <img 
//                     src="/qr.png" 
//                     alt="Deposit QR Code" 
//                     className="w-48 h-48"
//                   />
//                 </div>

//                 {/* Deposit Address */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Deposit Address</label>
//                   <div className="flex items-center gap-2 p-4 bg-card/50 rounded-lg border border-white/10">
//                     <code className="flex-1 text-sm font-mono break-all">
//                       {depositAddress}
//                     </code>
//                     <button
//                       onClick={handleCopyAddress}
//                       className="p-2 hover:bg-card rounded transition-colors flex-shrink-0"
//                       title="Copy address"
//                     >
//                       {copied ? (
//                         <Check size={20} className="text-profit" />
//                       ) : (
//                         <Copy size={20} className="text-muted-foreground" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Important Instructions */}
//                 <div className="space-y-4 p-4 bg-warning/10 border border-warning/30 rounded-lg">
//                   <div className="flex items-center gap-2">
//                     <AlertCircle size={20} className="text-warning flex-shrink-0" />
//                     <h3 className="font-semibold">Important Instructions</h3>
//                   </div>
//                   <ul className="space-y-2 text-sm ml-7">
//                     <li className="flex items-start gap-2">
//                       <span className="text-warning font-bold mt-0.5">•</span>
//                       <span>Only send <strong>USDT (TRC20)</strong> to this address</span>
//                     </li>
//                     {/* <li className="flex items-start gap-2">
//                       <span className="text-warning font-bold mt-0.5">•</span>
//                       <span>Minimum deposit: <strong>$10 USDT</strong></span>
//                     </li> */}
//                     <li className="flex items-start gap-2">
//                       <span className="text-warning font-bold mt-0.5">•</span>
//                       <span>Network: <strong>{network} (TRON)</strong></span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <span className="text-warning font-bold mt-0.5">•</span>
//                       <span>Confirmation time: <strong>15-30 minutes</strong></span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <span className="text-warning font-bold mt-0.5">•</span>
//                       <span>Do not send any other tokens to this address</span>
//                     </li>
//                   </ul>
//                 </div>

//                 {/* Next Button */}
//                 <button
//                   onClick={() => setStep(2)}
//                   className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200"
//                 >
//                   I've Sent USDT - Submit Transaction
//                 </button>
//               </GlassCard>
//             )}

//             {/* Step 2: Submit Transaction */}
//             {step === 2 && (
//               <GlassCard heavy className="p-8 space-y-6">
//                 <div className="text-center">
//                   <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <CheckCircle className="text-primary" size={32} />
//                   </div>
//                   <h2 className="text-2xl font-bold mb-2">Submit Transaction</h2>
//                   <p className="text-sm text-muted-foreground">
//                     Enter your transaction details below
//                   </p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   {/* Amount Input */}
//                   <div>
//                     <label className="block text-sm font-semibold mb-3">
//                       Amount Sent (USDT)
//                     </label>
//                     <div className="relative">
//                       <span className="absolute left-4 top-3 text-muted-foreground font-semibold">
//                         $
//                       </span>
//                       <input
//                         type="number"
//                         value={amount}
//                         onChange={(e) => setAmount(e.target.value)}
//                         placeholder="0.00"
//                         min="10"
//                         step="0.01"
//                         className="w-full bg-input border border-white/10 rounded-lg pl-8 pr-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
//                         required
//                         disabled={submitting}
//                       />
//                     </div>
//                     {/* <p className="text-xs text-muted-foreground mt-2">
//                       Minimum: $10 USDT
//                     </p> */}
//                   </div>

//                   {/* Transaction Hash Input */}
//                   <div>
//                     <label className="block text-sm font-semibold mb-3">
//                       Transaction Hash (TxID)
//                     </label>
//                     <input
//                       type="text"
//                       value={txHash}
//                       onChange={(e) => setTxHash(e.target.value)}
//                       placeholder="Enter your transaction hash from wallet"
//                       className="w-full bg-input border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
//                       required
//                       disabled={submitting}
//                     />
//                     <p className="text-xs text-muted-foreground mt-2">
//                       You can find this in your wallet's transaction history
//                     </p>
//                   </div>

//                   {/* Screenshot Upload */}
//                   <div>
//                     <label className="block text-sm font-semibold mb-3">
//                       Transaction Screenshot
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="file"
//                         accept="image/jpeg,image/jpg,image/png,image/webp"
//                         onChange={handleFileChange}
//                         className="w-full bg-input border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 file:cursor-pointer"
//                         required
//                         disabled={submitting}
//                       />
//                     </div>
//                     {screenshot && (
//                       <p className="text-xs text-profit mt-2 flex items-center gap-1">
//                         <CheckCircle size={14} />
//                         Selected: {screenshot.name} ({(screenshot.size / 1024).toFixed(2)} KB)
//                       </p>
//                     )}
//                     {!screenshot && (
//                       <p className="text-xs text-muted-foreground mt-2">
//                         Upload a screenshot of your transaction (JPEG, PNG, or WebP - Max 5MB)
//                       </p>
//                     )}
//                   </div>

//                   {/* Sender Address Input */}
//                   <div>
//                     <label className="block text-sm font-semibold mb-2">
//                       The address of the user’s address from where amount is paid
//                     </label>
//                     <input
//                       type="text"
//                       value={senderAddress}
//                       onChange={(e) => setSenderAddress(e.target.value)}
//                       placeholder="Enter sender address"
//                       maxLength={34}
//                       className="w-full bg-input border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
//                       required
//                       disabled={submitting}
//                     />
//                     <p className="text-xs text-muted-foreground mt-2">
//                       Max length: 34 characters
//                     </p>
//                   </div>

//                   {/* Buttons */}
//                   <div className="flex gap-3">
//                     <button
//                       type="button"
//                       onClick={() => setStep(1)}
//                       disabled={submitting}
//                       className="flex-1 bg-card border border-border hover:border-primary text-foreground font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
//                     >
//                       Back
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={submitting || !amount || !txHash || !screenshot}
//                       className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                     >
//                       {submitting ? (
//                         <>
//                           <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
//                           Submitting...
//                         </>
//                       ) : (
//                         <>
//                           <CheckCircle size={20} />
//                           Submit Deposit
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </form>

//                 {/* Info Note */}
//                 <div className="p-5 bg-gradient-to-r from-amber-500/20 to-orange-500/15 rounded-lg border-2 border-amber-500/50 hover:border-amber-500/70 transition-colors">
//                   <div className="flex items-start gap-3">
//                     <AlertCircle className="text-amber-500 mt-0.5 flex-shrink-0" size={20} />
//                     <div>
//                       <p className="text-sm font-bold text-amber-300 mb-1">Important Note</p>
//                       <p className="text-sm text-amber-100">
//                         After submission, your transaction will be verified automatically within 5-10 minutes. You will receive a confirmation once the deposit is credited to your account.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </GlassCard>
//             )}

//             {/* Help Section */}
//             <GlassCard className="p-6">
//               <h3 className="font-semibold mb-4">Need Help?</h3>
//               <div className="space-y-3 text-sm">
//                 <div>
//                   <p className="font-semibold mb-1">Q.1 Where can I find my transaction hash?</p>
//                   <p className="text-muted-foreground">
//                     Open your wallet app, go to transaction history, and copy the transaction ID/hash after sending USDT.
//                   </p>
//                 </div>
//                 <div>
//                   <p className="font-semibold mb-1">Q.2 Why do I need to upload a screenshot?</p>
//                   <p className="text-muted-foreground">
//                     The screenshot helps us verify your transaction faster and provides additional proof of payment.
//                   </p>
//                 </div>
//                 <div>
//                   <p className="font-semibold mb-1">Q.3 How long does verification take?</p>
//                   <p className="text-muted-foreground">
//                     Typically 5-10 minutes after the TRON network confirms your transaction (usually 1-2 minutes).
//                   </p>
//                 </div>
//                 <div>
//                   <p className="font-semibold mb-1">Q.4 What if I sent to the wrong address?</p>
//                   <p className="text-muted-foreground">
//                     Unfortunately, blockchain transactions cannot be reversed. Always double-check the address before sending.
//                   </p>
//                 </div>
//               </div>
//             </GlassCard>
//           </>
//         )}
//       </div>
//     </main>
//   );
// }





















import { useState, useEffect } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { Wallet, Copy, Check, AlertCircle, CheckCircle, QrCode } from "lucide-react";
import { apiClient } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface DepositAddressResponse {
  success: boolean;
  network: string;
  depositAddress: string;
}

interface DepositSubmitResponse {
  success: boolean;
}

export default function Deposit() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [senderAddress, setSenderAddress] = useState("");
  const [depositAddress, setDepositAddress] = useState<string>('');
  const [network, setNetwork] = useState<string>("TRC20");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    fetchDepositAddress();
  }, []);

  const fetchDepositAddress = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<DepositAddressResponse>("/admin/depositeAddress");
      console.log("Deposit Address Response:", response.data);
      setDepositAddress(response.data.depositAddress);
      const data = response.data as DepositAddressResponse;
      
      if (data.success) {
        setNetwork(data.network);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load deposit address");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAddress = () => {
    if (depositAddress) {
      navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, or WebP)');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should not exceed 5MB');
        e.target.value = '';
        return;
      }
      setScreenshot(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!amount || parseFloat(amount) < 10) {
      setError("Minimum deposit amount is $10 USDT");
      return;
    }
    if (!txHash || txHash.length < 60) {
      setError("Please enter a valid transaction hash");
      return;
    }
    if (!senderAddress || senderAddress.length !== 34) {
      setError("Please enter the sending address (34 characters)");
      return;
    }
    if (!screenshot) {
      setError("Please upload a transaction screenshot");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError("Authentication required. Please login again.");
        return;
      }

      const formData = new FormData();
      formData.append('tx_hash', txHash);
      formData.append('amount', amount);
      formData.append('sender_address', senderAddress);
      formData.append('screenshot', screenshot);

      const response = await apiClient.post<DepositSubmitResponse>("/deposit/submit", formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setSuccess("Deposit submitted successfully! Your transaction will be verified within 15-30 minutes.");
        setAmount("");
        setTxHash("");
        setSenderAddress("");
        setScreenshot(null);
        setStep(1);
        
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to submit deposit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // <main className="p-4 lg:p-8 lg:ml-64 min-h-screen overflow-x-hidden w-full">
    //   <div className="max-w-3xl mx-auto space-y-8 animate-fade-in w-full min-w-0">
 <main className="w-full max-w-full overflow-x-hidden px-3 sm:px-4 lg:px-8 lg:ml-64 min-h-screen">
      <div className="w-full max-w-3xl mx-auto space-y-6 sm:space-y-8">

        <div>
          <h1 className="text-3xl font-bold mb-2">Deposit USDT</h1>
          <p className="text-muted-foreground">
            Deposit USDT (TRC20) to your account
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <GlassCard heavy className="p-8 text-center">
            <div className="animate-spin mb-4 mx-auto w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted-foreground">Loading deposit address...</p>
          </GlassCard>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-loss/20 border border-loss/30 text-loss px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} className="flex-shrink-0" />
            {/* FIX 2: min-w-0 + break-words prevents text overflow */}
            <span className="min-w-0 break-words">{error}</span>
          </div>
        )}

        {/* Success State */}
        {success && (
          <div className="bg-profit/20 border border-profit/30 text-profit px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle size={20} className="flex-shrink-0" />
            <span className="min-w-0 break-words">{success}</span>
          </div>
        )}

        {/* Main Content */}
        {!loading && depositAddress && (
          <>
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className={`flex items-center gap-2 ${step === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
                  step === 1 ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
                }`}>
                  1
                </div>
                <span className="text-sm font-semibold hidden sm:inline">Deposit Address</span>
              </div>
              
              <div className="h-px w-12 bg-border flex-shrink-0"></div>
              
              <div className={`flex items-center gap-2 ${step === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
                  step === 2 ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
                }`}>
                  2
                </div>
                <span className="text-sm font-semibold hidden sm:inline">Submit Transaction</span>
              </div>
            </div>

            {/* Step 1: Deposit Address */}
            {step === 1 && (
              // <GlassCard heavy className="p-4 sm:p-8 space-y-6 min-w-0">
              <GlassCard className="p-4 sm:p-6 space-y-4 w-full max-w-full overflow-hidden">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="text-primary" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Your Deposit Address</h2>
                  <p className="text-sm text-muted-foreground">
                    Send USDT (TRC-20) to this address
                  </p>
                </div>

                {/* Network Badge */}
                <div className="flex justify-center">
                  <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-semibold">
                    Network: TRON
                  </span>
                </div>

                {/* QR Code */}
                <div className="flex justify-center p-6 bg-white rounded-lg">
                  <img 
                    src="/qr.png" 
                    alt="Deposit QR Code" 
                    className="w-48 h-48"
                  />
                </div>

                {/* Deposit Address */}
                <div className="min-w-0">
                  <label className="block text-sm font-semibold mb-2">Deposit Address</label>
                  {/* FIX 4: overflow-hidden + min-w-0 on container, break-all on code */}
                  <div className="flex items-center gap-2 p-4 bg-card/50 rounded-lg border border-white/10 overflow-hidden min-w-0">
                    {/* <code className="flex-1 text-sm font-mono break-all min-w-0 overflow-hidden"> */}
                    <code className="flex-1 text-xs sm:text-sm break-all overflow-hidden">
                      {depositAddress}
                    </code>
                    <button
                      onClick={handleCopyAddress}
                      className="p-2 hover:bg-card rounded transition-colors flex-shrink-0"
                      title="Copy address"
                    >
                      {copied ? (
                        <Check size={20} className="text-profit" />
                      ) : (
                        <Copy size={20} className="text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Important Instructions */}
                <div className="space-y-4 p-4 bg-warning/10 border border-warning/30 rounded-lg min-w-0">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={20} className="text-warning flex-shrink-0" />
                    <h3 className="font-semibold">Important Instructions</h3>
                  </div>
                  <ul className="space-y-2 text-sm ml-7">
                    <li className="flex items-start gap-2">
                      <span className="text-warning font-bold mt-0.5 flex-shrink-0">•</span>
                      <span>Only send <strong>USDT (TRC20)</strong> to this address</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-warning font-bold mt-0.5 flex-shrink-0">•</span>
                      <span>Network: <strong>{network} (TRON)</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-warning font-bold mt-0.5 flex-shrink-0">•</span>
                      <span>Confirmation time: <strong>15-30 minutes</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-warning font-bold mt-0.5 flex-shrink-0">•</span>
                      <span>Do not send any other tokens to this address</span>
                    </li>
                  </ul>
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200"
                >
                  I've Sent USDT - Submit Transaction
                </button>
              </GlassCard>
            )}

            {/* Step 2: Submit Transaction */}
            {step === 2 && (
              <GlassCard heavy className="p-4 sm:p-8 space-y-6 min-w-0">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-primary" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Submit Transaction</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your transaction details below
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      Amount Sent (USDT)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-muted-foreground font-semibold">
                        $
                      </span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        min="10"
                        step="0.01"
                        className="w-full bg-input border border-white/10 rounded-lg pl-8 pr-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  {/* Transaction Hash Input */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      Transaction Hash (TxID)
                    </label>
                    {/* FIX 5: w-full + overflow-hidden on mono inputs */}
                    <input
                      type="text"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      placeholder="Enter your transaction hash from wallet"
                      className="w-full bg-input border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all overflow-hidden text-ellipsis"
                      required
                      disabled={submitting}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      You can find this in your wallet's transaction history
                    </p>
                  </div>

                  {/* Screenshot Upload */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      Transaction Screenshot
                    </label>
                    <div className="relative w-full overflow-hidden">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="w-full bg-input border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 file:cursor-pointer"
                        required
                        disabled={submitting}
                      />
                    </div>
                    {screenshot && (
                      <p className="text-xs text-profit mt-2 flex items-center gap-1 min-w-0">
                        <CheckCircle size={14} className="flex-shrink-0" />
                        {/* FIX 6: truncate long filename */}
                        <span className="truncate">{screenshot.name}</span>
                        <span className="flex-shrink-0">({(screenshot.size / 1024).toFixed(2)} KB)</span>
                      </p>
                    )}
                    {!screenshot && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Upload a screenshot of your transaction (JPEG, PNG, or WebP - Max 5MB)
                      </p>
                    )}
                  </div>

                  {/* Sender Address Input */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      The address of the user's address from where amount is paid
                    </label>
                    <input
                      type="text"
                      value={senderAddress}
                      onChange={(e) => setSenderAddress(e.target.value)}
                      placeholder="Enter sender address"
                      maxLength={34}
                      className="w-full bg-input border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all overflow-hidden text-ellipsis"
                      required
                      disabled={submitting}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Max length: 34 characters
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={submitting}
                      className="flex-1 bg-card border border-border hover:border-primary text-foreground font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !amount || !txHash || !screenshot}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full flex-shrink-0"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} className="flex-shrink-0" />
                          Submit Deposit
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Info Note */}
                <div className="p-5 bg-gradient-to-r from-amber-500/20 to-orange-500/15 rounded-lg border-2 border-amber-500/50 hover:border-amber-500/70 transition-colors">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-amber-500 mt-0.5 flex-shrink-0" size={20} />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-amber-300 mb-1">Important Note</p>
                      <p className="text-sm text-amber-100">
                        After submission, your transaction will be verified automatically within 5-10 minutes. You will receive a confirmation once the deposit is credited to your account.
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Help Section */}
            <GlassCard className="p-6 min-w-0">
              <h3 className="font-semibold mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold mb-1">Q.1 Where can I find my transaction hash?</p>
                  <p className="text-muted-foreground">
                    Open your wallet app, go to transaction history, and copy the transaction ID/hash after sending USDT.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Q.2 Why do I need to upload a screenshot?</p>
                  <p className="text-muted-foreground">
                    The screenshot helps us verify your transaction faster and provides additional proof of payment.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Q.3 How long does verification take?</p>
                  <p className="text-muted-foreground">
                    Typically 5-10 minutes after the TRON network confirms your transaction (usually 1-2 minutes).
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Q.4 What if I sent to the wrong address?</p>
                  <p className="text-muted-foreground">
                    Unfortunately, blockchain transactions cannot be reversed. Always double-check the address before sending.
                  </p>
                </div>
              </div>
            </GlassCard>
          </>
        )}
      </div>
    </main>
  );
}




















