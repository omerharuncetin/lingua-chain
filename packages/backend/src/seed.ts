import prisma from "./lib/prisma";

const avatarSeedData = [
  {
    name: "LingoBot",
    description: "Starter robot assistant",
    price: 0,
    imageUrl: "/images/nfts/avatars/lingobot.png",
    lessons: 5,
    blockchainIndex: 0
  },
  {
    name: "Polyglot Panda",
    description: "Cute and curious panda",
    price: 50,
    imageUrl: "/images/nfts/avatars/polyglot-panda.png",
    lessons: 7,
    blockchainIndex: 1
  },
  {
    name: "Grammar Goblin",
    description: "Mischievous green wizard",
    price: 100,
    imageUrl: "/images/nfts/avatars/grammar-goblin.png",
    lessons: 10,
    blockchainIndex: 2
  },
  {
    name: "Syntax Seraph",
    description: "Angelic figure, glowy",
    price: 200,
    imageUrl: "/images/nfts/avatars/syntax-seraph.png",
    lessons: 15,
    blockchainIndex: 3
  },
  {
    name: "Verb Viper",
    description: "Neon smart snake",
    price: 500,
    imageUrl: "/images/nfts/avatars/verb-viper.png",
    lessons: 25,
    blockchainIndex: 4
  }
];

export async function seedAvatars() {
  console.log('Starting avatar seeding...');

  try {
    // Check if avatars already exist
    const existingAvatars = await prisma.avatar.count();

    if (existingAvatars > 0) {
      console.log(`Found ${existingAvatars} existing avatars. Skipping seed or updating...`);

      // Option 1: Update existing avatars
      // for (const avatarData of avatarSeedData) {
      //   const exist = 
      //   await prisma.avatar.upsert({
      //     where: { name: avatarData.name },
      //     update: avatarData,
      //     create: avatarData,
      //   });
      //   console.log(`✅ Upserted avatar: ${avatarData.name}`);
      // }
    } else {
      // Option 2: Create all avatars from scratch
      for (const avatarData of avatarSeedData) {
        const avatar = await prisma.avatar.create({
          data: avatarData,
        });
        console.log(`✅ Created avatar: ${avatar.name} (ID: ${avatar.id})`);
      }
    }

    console.log('Avatar seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding avatars:', error);
    throw error;
  }
}