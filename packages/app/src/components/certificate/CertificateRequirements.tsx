
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Trophy, Shield, Play, ArrowLeft } from "lucide-react";

interface CertificateRequirementsProps {
  activeLevel: string;
  onTabChange: (level: string) => void;
  onStartExam: () => void;
  onNavigateBack: () => void;
}

const CertificateRequirements = ({
  activeLevel,
  onTabChange,
  onStartExam,
  onNavigateBack
}: CertificateRequirementsProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={onNavigateBack}
              className="mr-4 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">Certificate Exams</h1>
              <p className="text-slate-300">Choose your level and earn your certificate</p>
            </div>
          </div>

          {/* Level Tabs */}
          <Tabs value={activeLevel} onValueChange={onTabChange} className="mb-8">
            <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border border-slate-600/30">
              <TabsTrigger value="A1" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">A1</TabsTrigger>
              <TabsTrigger value="A2" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">A2</TabsTrigger>
              <TabsTrigger value="B1" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">B1</TabsTrigger>
              <TabsTrigger value="B2" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">B2</TabsTrigger>
              <TabsTrigger value="C1" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">C1</TabsTrigger>
              <TabsTrigger value="C2" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">C2</TabsTrigger>
            </TabsList>

            <TabsContent value={activeLevel}>
              {/* Requirements Card */}
              <Card className="p-8 bg-slate-900/70 border border-slate-700/50 backdrop-blur-xl mb-8 shadow-2xl shadow-cyan-500/25 rounded-2xl">
                <div className="text-center mb-6">
                  <Trophy className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">{activeLevel} Certificate Requirements</h2>
                  <p className="text-slate-300">Complete these requirements to earn your {activeLevel} certificate</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3 p-4 bg-emerald-500/10 border border-emerald-400/20 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <span className="text-white">Complete all {activeLevel} level lessons</span>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-cyan-500/10 border border-cyan-400/20 rounded-xl">
                    <div className="w-6 h-6 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                    </div>
                    <span className="text-white">Pass exam with 70% or higher</span>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-purple-500/10 border border-purple-400/20 rounded-xl">
                    <Shield className="w-6 h-6 text-purple-400" />
                    <span className="text-white">Certificate will be minted as a soulbound NFT</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-600/30 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-cyan-400 mb-3">{activeLevel} Exam Details</h3>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li>• 20 {activeLevel} level grammar and language comprehension questions</li>
                    <li>• 20-minute time limit - exam automatically fails if time expires</li>
                    <li>• Pass with 70% or higher to earn {activeLevel} certificate</li>
                    <li>• Earn certificate NFT permanently linked to your wallet</li>
                    <li>• Timer counts down continuously during the exam</li>
                  </ul>
                </div>

                <Button
                  onClick={onStartExam}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start {activeLevel} Exam
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CertificateRequirements;
