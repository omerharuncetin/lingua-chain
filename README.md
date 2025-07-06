# 🧠 LinguaChain  
*Learn. Earn. Certify. On-Chain.*

LinguaChain is a gamified, Web3-powered English learning platform where users complete interactive lessons across CEFR levels (A1 to C2), earn tokens, and mint **soulbound NFT certificates** — all seamlessly integrated with Ethereum & Celo.

---

## 🌍 What is LinguaChain?

LinguaChain is Duolingo meets Web3:

- 🧠 Learn English through fun, bite-sized lessons
- 🏆 Earn in game coins for completing lessons
- 🎓 Pass timed exams to mint **soulbound certificates** (SBTs)
- 👤 Use avatars (NFTs) to boost your daily lesson limit
- 💰 Use **USDC** to buy beautiful designed avatars
- 📊 Climb the leaderboard and showcase your progress

---

## 🎮 Features

- 📚 **Gamified Lesson Flow**  
  Complete structured, Duolingo-style lessons for each CEFR level (A1–C2). Each level contains interactive exercises: multiple choice, fill-in-the-blank, sentence builder, and more.

- ⏱️ **Timed Certification Exams**  
  After completing a level, users can take a 20-minute timed exam (e.g., 20 B1-level grammar questions). A passing score (≥70%) lets them mint a **soulbound NFT certificate**.

- 🧾 **On-Chain Proof of Learning**  
  Certificates are **non-transferable NFTs**, forever tied to the user’s wallet.

- 👾 **NFT Avatar Marketplace**  
  Avatars increase daily lesson limits and are purchasable using **USDC**.

- 🪙 **Token Rewards System** (soon)
  Earn in-game Coins per lesson. Convert coins to USDC based on performance and streak conditions .

- 🧑‍🎓 **Identity & Storage**  
  - Uses **Self** for wallet-linked identity verification during certification  
  - Uses **Walrus** for decentralized storage of lesson and progress data

- 🏆 **Leaderboard & Stats** (soon)
  View global ranks based on XP, badges, and level certifications. (soon)

---

## 🛠️ Tech Stack

| Layer         | Tech                                              |
|---------------|---------------------------------------------------|
| Frontend      | `Next.js 15`, `TypeScript`, `TailwindCSS`, `shadcn/ui` |
| Backend       | `Node.js`, `TypeScript`, `Docker`, `PostgreSQL` |
| Web3 Stack    | `wagmi`, `viem`, `foundry`, `ERC-721`, `ERC-721 SBT` |
| Identity & ZK     | [`Self`](https://self.xyz/)                         |
| Decentralized Storage | [`Walrus`](https://www.walrus.xyz/)                  |
| Contracts     | `Solidity`, deployed to Celo testnet          |

---

## 🚀 Getting Started

```bash
git clone https://github.com/omerharuncetin/lingua-chain.git
cd lingua-chain
yarn install
yarn dev