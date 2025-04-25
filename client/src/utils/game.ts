export const calculateLevel = (xp: number) => {
    return Math.floor(Math.sqrt(xp));
};

export const calculateNextLevelXP = (currentLevel: number) => {
    return Math.pow(currentLevel + 1, 2);
};

export const calculateProgress = (xp: number) => {
    const currentLevel = calculateLevel(xp);
    const nextLevelXP = calculateNextLevelXP(currentLevel);
    const currentLevelXP = Math.pow(currentLevel, 2);
    return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
}; 