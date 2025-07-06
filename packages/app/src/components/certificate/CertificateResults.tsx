
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, XCircle, Shield } from "lucide-react";
import { SelfApp, SelfAppBuilder, SelfQRcodeWrapper } from '@selfxyz/qrcode';
import { useState } from "react";
import { useAccount } from "wagmi";
import { LOGO_BASE64 } from "@/app/config";
import { CEFRLevel, getCertificateAddressByLevel } from "@/lib/utils";
import { toast } from "sonner";

interface CertificateResultsProps {
  activeLevel: string;
  score: number;
  totalQuestions: number;
  timeLeft: number;
  timeFailed: boolean;
  onMintCertificate: () => void;
  onNavigateToLearning: () => void;
  onNavigateToDashboard: () => void;
}

const CertificateResults = ({
  activeLevel,
  score,
  totalQuestions,
  timeLeft,
  timeFailed,
  onMintCertificate,
  onNavigateToLearning,
  onNavigateToDashboard
}: CertificateResultsProps) => {
  const [selfApp, setSelfApp] = useState<SelfApp | undefined>(undefined)
  const { address } = useAccount();

  const [isMinting, setIsMinting] = useState(false);
  const [resultArrived, setResultArrived] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMint = () => {
    const certificateAddress = getCertificateAddressByLevel(activeLevel as CEFRLevel);
    const selfApp = new SelfAppBuilder({
      appName: "Lingua Chain",
      scope: "scopeseedbest",
      endpoint: "0x352C49d519AF8d9d294345E29D50c2f6d6E3901E", // Your SelfVerificationRoot contract
      endpointType: "staging_celo", // "staging_celo" for testnet, "celo" for mainnet
      logoBase64: LOGO_BASE64,
      userId: address, // User's wallet address (required)
      userIdType: "hex", // "uuid" or "hex"
      version: 2, // V2 configuration
      disclosures: {
        // Passport data fields
        nationality: true,
        //name: true,

        // Verification rules (integrated in disclosures for V2)
        //ofac: true // OFAC compliance checking (boolean)
      },
      devMode: true, // Set to true for development/testing, false for production
      userDefinedData: certificateAddress.substring(2), // Optional: custom data passed to contract
    }).build();

    toast.info('Scan QR Code with Self to mint certificate')

    setSelfApp(selfApp);
    setIsMinting(true);
  }

  const getResult = () => {
    if (timeFailed) {
      return { level: "Failed - Time Expired", passed: false };
    }

    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 70) {
      return {
        level: `${activeLevel} Certificate`,
        passed: true
      };
    }
    return { level: `${activeLevel} - Not Passed`, passed: false };
  };

  const result = getResult();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="p-12 bg-slate-900/70 border border-slate-700/50 backdrop-blur-xl max-w-lg mx-auto text-center shadow-2xl shadow-cyan-500/25 rounded-2xl relative z-10">
        <div className="animate-fade-in">
          {result.passed ? (
            <Trophy className="w-24 h-24 text-cyan-400 mx-auto mb-6" />
          ) : (
            <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
          )}

          <h2 className="text-3xl font-bold mb-4 text-white">
            {timeFailed ? "Time Expired!" : result.passed ? "Exam Passed!" : "Keep Practicing!"}
          </h2>
          {selfApp && !resultArrived &&
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <Card className="p-6 bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 max-w-md w-full mx-4 flex flex-col gap-4">
                <span className="text-lg">Scan QR with Self to Mint Certificate</span>
                <SelfQRcodeWrapper onError={(error) => {
                  toast.error('oops');
                  console.log(error);
                  setIsMinting(false)
                  setResultArrived(true);
                }} selfApp={selfApp} onSuccess={() => {
                  toast.success('minted!')
                  setIsMinting(false)
                  setResultArrived(true);
                  onMintCertificate();
                }} />
              </Card>
            </div>
          }

          {!isMinting &&
            <div className="mb-6">
              <p className="text-slate-300 mb-2">Your result:</p>
              <p className="text-2xl font-bold text-cyan-400 mb-2">{result.level}</p>
              {!timeFailed && (
                <>
                  <p className="text-sm text-slate-400">Score: {score}/{totalQuestions} ({Math.round((score / totalQuestions) * 100)}%)</p>
                  <p className="text-sm text-slate-400">Time remaining: {formatTime(timeLeft)}</p>
                </>
              )}
              {timeFailed && (
                <p className="text-sm text-red-400">You ran out of time to complete the exam</p>
              )}
            </div>
          }

          {result.passed && !timeFailed && (
            <>
              <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-400/20 rounded-xl">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Shield className="w-6 h-6 text-cyan-400" />
                  <span className="font-bold text-white">Soulbound Certificate</span>
                </div>
                <p className="text-xs text-slate-300">
                  This NFT will be permanently linked to your wallet as proof of your {activeLevel} achievement
                </p>
              </div>

              <Button
                onClick={handleMint}
                disabled={isMinting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 mb-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
              >
                {isMinting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Minting Certificate...</span>
                  </div>
                ) : (
                  `Mint ${activeLevel} Certificate NFT`
                )}
              </Button>


            </>
          )}
          {!isMinting &&
            <div className="space-y-3">
              <Button
                onClick={onNavigateToLearning}
                variant="outline"
                className="w-full border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 rounded-xl"
              >
                Continue Learning
              </Button>
              <Button
                onClick={onNavigateToDashboard}
                variant="outline"
                className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/30 rounded-xl"
              >
                View Dashboard
              </Button>
            </div>}
        </div>
      </Card>
    </div>
  );
};

export default CertificateResults;
