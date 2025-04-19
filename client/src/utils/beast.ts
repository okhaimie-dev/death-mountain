import { generateBeastEntropy, getBeastType, getBeastTier, getBeastName, getBeastDescription } from './entropy';

export interface Beast {
  id: number;
  name: string;
  description: string;
  health: number;
  level: number;
  type: string;
  tier: string;
  special2: number;
  special3: number;
}

export const generateBeast = (beastSeed: bigint): Beast | null => {
  if (!beastSeed || beastSeed === BigInt(0)) return null;
  
  const beastEntropy = generateBeastEntropy(beastSeed);
  if (!beastEntropy) return null;
  
  return {
    ...beastEntropy,
    name: getBeastName(beastEntropy.id, beastEntropy.level, beastEntropy.special2, beastEntropy.special3),
    description: getBeastDescription(beastEntropy.id, beastEntropy.level, beastEntropy.special2, beastEntropy.special3),
    type: getBeastType(beastEntropy.id),
    tier: getBeastTier(beastEntropy.id)
  };
}; 