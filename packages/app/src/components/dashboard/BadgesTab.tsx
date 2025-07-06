import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Shield, Award, Calendar, ExternalLink, Loader2, AlertCircle, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Certificate } from "@/app/hooks/useCertificateHooks";
import { Badge as BadgeInterface } from "@/app/hooks/useBadgeHooks";
import { useMultipleNFTMetadata } from "@/app/hooks/useNFTMetadataHook";

interface BadgesTabProps {
  certificates: Certificate[];
  badges: BadgeInterface[];
}

const BadgesTab = ({ certificates, badges }: BadgesTabProps) => {
  const navigate = useRouter();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Fetch all NFT metadata
  const allMetadataUrls = [
    ...certificates.map(cert => cert.certificateUrl),
    ...badges.map(badge => badge.badgeUrl)
  ];

  const metadataStates = useMultipleNFTMetadata(allMetadataUrls);

  // Helper function to format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get language level emoji/icon
  const getLanguageLevelIcon = (level: string) => {
    const levelMap: { [key: string]: string } = {
      'A1': '🌱',
      'A2': '🌿',
      'B1': '🌳',
      'B2': '🎯',
      'C1': '🏆',
      'C2': '👑',
      'beginner': '🌱',
      'intermediate': '🌳',
      'advanced': '🏆',
      'expert': '👑'
    };
    return levelMap[level.toLowerCase()] || '📜';
  };

  const handleImageClick = (imageUrl: string, name: string) => {
    window.open(imageUrl, '_blank');
  };

  const renderNFTImage = (url: string | undefined, fallbackLevel: string) => {
    if (!url) return <div className="text-4xl">{getLanguageLevelIcon(fallbackLevel)}</div>;

    const metadataState = metadataStates[url];

    if (metadataState?.loading) {
      return (
        <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center bg-slate-700/50">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      );
    }

    if (metadataState?.error || !metadataState?.data) {
      return <div className="text-4xl">{getLanguageLevelIcon(fallbackLevel)}</div>;
    }

    return (
      <div className="relative group">
        <img
          src={metadataState.data.image}
          alt={metadataState.data.name}
          className="w-32 h-32 mx-auto rounded-xl object-cover border-2 border-slate-600/50 transition-all duration-300 group-hover:border-white/50 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className="hidden text-4xl">{getLanguageLevelIcon(fallbackLevel)}</div>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
          <Eye className="w-5 h-5 text-white" />
        </div>
      </div>
    );
  };

  const renderNFTDetails = (url: string | undefined, fallbackName: string, transactionHash: string) => {
    if (!url) return null;

    const metadataState = metadataStates[url];

    if (metadataState?.loading) {
      return <div className="text-xs text-slate-400">Loading metadata...</div>;
    }

    if (metadataState?.error) {
      return (
        <div className="flex items-center text-xs text-red-400">
          <AlertCircle className="w-3 h-3 mr-1" />
          Failed to load metadata
        </div>
      );
    }

    if (!metadataState?.data) return null;

    const metadata = metadataState.data;

    return (
      <div className="mt-3 space-y-2">
        <div className="p-3 bg-black/20 rounded-lg text-left">
          <h5 className="text-sm font-semibold text-white mb-2">{metadata.name}</h5>
          <p className="text-xs text-slate-300 mb-3">{metadata.description}</p>

          {metadata.attributes && metadata.attributes.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-300">Attributes:</div>
              <div className="grid grid-cols-2 gap-1">
                {metadata.attributes.map((attr, index) => (
                  <div key={index} className="bg-slate-700/50 rounded px-2 py-1">
                    <div className="text-xs text-slate-400">{attr.trait_type}</div>
                    <div className="text-xs font-semibold text-white">{attr.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            window.open(`https://alfajores.celoscan.io/tx/${transactionHash}`, '_blank');
          }}
          className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600/30"
          size="sm"
        >
          <ExternalLink className="w-3 h-3 mr-2" />
          View on Block Explorer
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Certificates Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white">Your Certificates</h3>
          <Button
            onClick={() => navigate.push("/certificate")}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl transition-all duration-300 hover:scale-105"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Take Exam
          </Button>
        </div>

        {certificates.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {certificates.map((certificate) => {
              const metadataState = metadataStates[certificate.certificateUrl];
              const displayName = metadataState?.data?.name || `${certificate.languageLevel} Certificate`;

              return (
                <Card
                  key={certificate.id}
                  className="p-6 cursor-pointer transition-all duration-300 backdrop-blur-xl rounded-2xl bg-slate-900/70 border border-cyan-400/30 hover:scale-105 hover:shadow-cyan-500/25"
                  onClick={() => setSelectedItem(selectedItem === `cert-${certificate.id}` ? null : `cert-${certificate.id}`)}
                >
                  <div className="text-center">
                    <div className="mb-3">
                      {renderNFTImage(certificate.certificateUrl, certificate.languageLevel)}
                    </div>
                    <h4 className="font-bold mb-1 text-white">{displayName}</h4>
                    <p className="text-xs text-slate-400 mb-2">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {formatDate(certificate.issueDate)}
                    </p>

                    <Badge className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30 mb-2">
                      <Shield className="w-3 h-3 mr-1" />
                      ZK Verified Certificate
                    </Badge>

                    {certificate.tokenId && (
                      <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30 mb-2 ml-2">
                        NFT #{certificate.tokenId}
                      </Badge>
                    )}

                    {selectedItem === `cert-${certificate.id}` && renderNFTDetails(certificate.certificateUrl, displayName, certificate.transactionHash)}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center bg-slate-900/50 border border-slate-600/30 rounded-2xl">
            <Trophy className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-slate-400 mb-2">No Certificates Yet</h4>
            <p className="text-sm text-slate-500 mb-4">
              Take language proficiency exams to earn verified certificates
            </p>
            <Button
              onClick={() => navigate.push("/certificate")}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
            >
              Start Your First Exam
            </Button>
          </Card>
        )}
      </div>

      {/* Badges Section */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white">Your Badges</h3>

        {badges.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => {
              const metadataState = metadataStates[badge.badgeUrl || ''];
              const displayName = metadataState?.data?.name || `${badge.languageLevel} Badge`;

              return (
                <Card
                  key={badge.id}
                  className="p-6 cursor-pointer transition-all duration-300 backdrop-blur-xl rounded-2xl bg-slate-900/70 border border-yellow-400/30 hover:scale-105 hover:shadow-yellow-500/25"
                  onClick={() => setSelectedItem(selectedItem === `badge-${badge.id}` ? null : `badge-${badge.id}`)}
                >
                  <div className="text-center">
                    <div className="mb-3">
                      {renderNFTImage(badge.badgeUrl, badge.languageLevel)}
                    </div>
                    <h4 className="font-bold mb-1 text-white">{displayName}</h4>
                    <p className="text-xs text-slate-400 mb-2">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {formatDate(badge.issueDate)}
                    </p>

                    <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 mb-2">
                      <Award className="w-3 h-3 mr-1" />
                      Achievement Badge
                    </Badge>

                    {badge.tokenId && (
                      <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30 mb-2 ml-2">
                        NFT #{badge.tokenId}
                      </Badge>
                    )}

                    {selectedItem === `badge-${badge.id}` && renderNFTDetails(badge.badgeUrl, displayName, badge.transactionHash)}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center bg-slate-900/50 border border-slate-600/30 rounded-2xl">
            <Award className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-slate-400 mb-2">No Badges Yet</h4>
            <p className="text-sm text-slate-500">
              Complete lessons and achieve milestones to earn badges
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BadgesTab;