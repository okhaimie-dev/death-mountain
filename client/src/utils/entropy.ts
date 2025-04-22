import * as starknet from "@scure/starknet";

// Constants for bit manipulation
const TWO_POW_64_NZ = BigInt("18446744073709551616");
const TWO_POW_32_NZ = BigInt("4294967296");
const TWO_POW_16_NZ = BigInt("65536");
const TWO_POW_8_NZ = BigInt("256");

/**
 * Gets lower 128 bits from a bigint
 * @param bigInt The bigint to get lower bits from
 * @returns Lower 128 bits as bigint
 */
function getLower128Bits(bigInt: bigint): bigint {
    // Create a mask with 128 1's
    const mask = (1n << 128n) - 1n;
    // Use bitwise AND to keep only the lower 128 bits
    return bigInt & mask;
}

/**
 * Splits a Poseidon hash into various sized random numbers
 * @param poseidon The Poseidon hash to split
 * @returns Object containing random numbers of various sizes
 */
function split_poseidon(poseidon: bigint) {
    let u128_low = getLower128Bits(poseidon);

    let rnd1_u64 = u128_low / TWO_POW_64_NZ;
    let rnd2_u64 = u128_low % TWO_POW_64_NZ;

    let rnd1_u32 = rnd1_u64 / TWO_POW_32_NZ;
    let rnd2_u32 = rnd1_u64 % TWO_POW_32_NZ;
    let rnd3_u32 = rnd2_u64 / TWO_POW_32_NZ;
    let rnd4_u32 = rnd2_u64 % TWO_POW_32_NZ;

    let rnd1_u16 = rnd3_u32 / TWO_POW_16_NZ;
    let rnd2_u16 = rnd3_u32 % TWO_POW_16_NZ;
    let rnd3_u16 = rnd4_u32 / TWO_POW_16_NZ;
    let rnd4_u16 = rnd4_u32 % TWO_POW_16_NZ;

    let rnd1_u8 = rnd3_u16 / TWO_POW_8_NZ;
    let rnd2_u8 = rnd3_u16 % TWO_POW_8_NZ;
    let rnd3_u8 = rnd4_u16 / TWO_POW_8_NZ;
    let rnd4_u8 = rnd4_u16 % TWO_POW_8_NZ;

    return {
        rnd1_u32,
        rnd2_u32,
        rnd1_u16,
        rnd2_u16,
        rnd1_u8,
        rnd2_u8,
        rnd3_u8,
        rnd4_u8,
    };
}

/**
 * Generates random values for various game mechanics
 * @param xp The adventurer's XP
 * @param adventurerEntropy The entropy seed
 * @returns Object containing random numbers of various sizes
 */
export function getRandomness(xp: number, adventurerEntropy: bigint) {
    let params = [BigInt(xp), adventurerEntropy];
    let poseidon = starknet.poseidonHashMany(params);
    let {
        rnd1_u32,
        rnd2_u32,
        rnd1_u16,
        rnd2_u16,
        rnd1_u8,
        rnd2_u8,
        rnd3_u8,
        rnd4_u8,
    } = split_poseidon(poseidon);

    return {
        rnd1: rnd1_u32,
        rnd2: rnd2_u32,
        rnd3: rnd1_u16,
        rnd4: rnd2_u16,
        rnd5: rnd1_u8,
        rnd6: rnd2_u8,
        rnd7: rnd3_u8,
        rnd8: rnd4_u8,
    };
}

/**
 * Gets randomness for battle actions
 * @param xp The adventurer's XP
 * @param actions The number of battle actions
 * @param adventurerEntropy The entropy seed
 * @returns Object containing random 8-bit numbers
 */
export function getRandomnessWithActions(
    xp: number,
    actions: number,
    adventurerEntropy: bigint
) {
    let params = [BigInt(xp), adventurerEntropy, BigInt(actions)];
    let poseidon = starknet.poseidonHashMany(params);
    let rnd1_u32 = poseidon % TWO_POW_32_NZ;

    let rnd1_u16 = rnd1_u32 / TWO_POW_16_NZ;
    let rnd2_u16 = rnd1_u32 % TWO_POW_16_NZ;

    let rnd1_u8 = rnd1_u16 / TWO_POW_8_NZ;
    let rnd2_u8 = rnd1_u16 % TWO_POW_8_NZ;
    let rnd3_u8 = rnd2_u16 / TWO_POW_8_NZ;
    let rnd4_u8 = rnd2_u16 % TWO_POW_8_NZ;

    return {
        rnd1_u8: Number(rnd1_u8),
        rnd2_u8: Number(rnd2_u8),
        rnd3_u8: Number(rnd3_u8),
        rnd4_u8: Number(rnd4_u8),
    };
}