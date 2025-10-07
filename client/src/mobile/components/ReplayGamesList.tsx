import { useController } from "@/contexts/controller";
import { useDynamicConnector } from "@/contexts/starknet";
import { useGameTokens } from "@/dojo/useGameTokens";
import { useStatistics } from "@/contexts/Statistics";
import { useStarknetApi } from "@/api/starknet";
import { calculateLevel } from "@/utils/game";
import { ChainId } from "@/utils/networkConfig";
import { getContractByName } from "@dojoengine/core";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RedeemIcon from "@mui/icons-material/Redeem";
import { Box, Button, Typography, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { useGameTokens as useMetagameTokens } from "metagame-sdk/sql";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addAddressPadding } from "starknet";

interface ReplayGamesListProps {
  onBack: () => void;
}

interface GameWithClaims {
  adventurer_id: number;
  player_name: string;
  xp?: number;
  dead?: boolean;
  expired?: boolean;
  game_over?: boolean;
  hasClaimableReward: boolean;
  isCheckingClaim: boolean;
  [key: string]: any; // Allow additional properties
}

export default function ReplayGamesList({ onBack }: ReplayGamesListProps) {
  const navigate = useNavigate();
  const { account } = useController();
  const { fetchAdventurerData } = useGameTokens();
  const { currentNetworkConfig } = useDynamicConnector();
  const { remainingSurvivorTokens } = useStatistics();
  const { checkRewardClaimed } = useStarknetApi();

  const namespace = currentNetworkConfig.namespace;
  const gameTokenAddress = getContractByName(
    currentNetworkConfig.manifest,
    namespace,
    "game_token_systems",
  )?.address;

  const { games: gamesData, loading: gamesLoading } = useMetagameTokens({
    mintedByAddress:
      currentNetworkConfig.chainId === ChainId.WP_PG_SLOT
        ? gameTokenAddress
        : addAddressPadding(currentNetworkConfig.dungeon),
    owner: account?.address,
    limit: 10000,
  });

  const [gameTokens, setGameTokens] = useState<GameWithClaims[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if a specific game has claimable rewards
  const checkClaimableReward = async (game: any): Promise<boolean> => {
    try {
      // Check basic eligibility criteria first
      if (
        currentNetworkConfig.chainId === ChainId.WP_PG_SLOT ||
        !game.xp ||
        game.xp < 9 ||
        !remainingSurvivorTokens ||
        remainingSurvivorTokens <= 0
      ) {
        return false;
      }

      // Additional check: game must be completed (dead, expired, or game_over)
      if (!game.dead && !game.expired && !game.game_over) {
        return false;
      }

      // Now check if the reward has already been claimed
      const alreadyClaimed = await checkRewardClaimed(game.adventurer_id);

      // Return true only if eligible AND not yet claimed
      return !alreadyClaimed;
    } catch (error) {
      console.error(
        `Error checking claim status for game ${game.adventurer_id}:`,
        error,
      );
      return false;
    }
  };

  useEffect(() => {
    async function fetchAdventurers() {
      if (!gamesData) return;

      const games = await fetchAdventurerData(gamesData);
      const completedRuns = games.filter(
        (game: any) => game.dead || game.expired || game.game_over,
      );

      // Sort by adventurer ID (newest first)
      const sortedGames = completedRuns.sort(
        (a: any, b: any) => b.adventurer_id - a.adventurer_id,
      );

      // Initialize games with claim checking status
      const gamesWithClaimStatus: GameWithClaims[] = sortedGames.map(
        (game) => ({
          ...game,
          hasClaimableReward: false,
          isCheckingClaim: true,
        }),
      );

      setGameTokens(gamesWithClaimStatus);
      setLoading(false);

      // Check claims for each game asynchronously
      sortedGames.forEach(async (game: any, index: number) => {
        const hasClaimableReward = await checkClaimableReward(game);

        setGameTokens((prev) =>
          prev.map((g, i) =>
            i === index
              ? { ...g, hasClaimableReward, isCheckingClaim: false }
              : g,
          ),
        );
      });
    }

    fetchAdventurers();
  }, [gamesData, remainingSurvivorTokens]);

  const handleWatchGame = (gameId: number) => {
    navigate(`/survivor/watch?id=${gameId}`);
  };

  const handleClaim = (adventurerId: number) => {
    navigate(`/survivor/claim?id=${adventurerId}`);
  };

  const claimableCount = gameTokens.filter(
    (game) => game.hasClaimableReward,
  ).length;

  return (
    <motion.div
      key="replay-games-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ width: "100%" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          justifyContent: "center",
        }}
      >
        <Box sx={styles.adventurersHeader}>
          <Button
            variant="text"
            size="large"
            onClick={onBack}
            sx={styles.backButton}
            startIcon={<ArrowBackIcon fontSize="large" sx={{ mr: 1 }} />}
          >
            <Typography variant="h4" color="primary">
              Replay Games
            </Typography>
          </Button>
          {claimableCount > 0 && (
            <Chip
              icon={<RedeemIcon />}
              label={`${claimableCount} Claimable`}
              color="warning"
              variant="outlined"
              sx={{ ml: 1, fontSize: "12px" }}
              title="These games have verified unclaimed rewards ready to claim."
            />
          )}
        </Box>
      </Box>

      <Box sx={styles.listContainer}>
        {loading || gamesLoading ? (
          <Typography sx={{ textAlign: "center", py: 2 }}>
            Loading...
          </Typography>
        ) : (
          gameTokens.map((game: GameWithClaims, index: number) => (
            <motion.div
              key={game.adventurer_id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1,
                delay: index * 0.1,
              }}
            >
              <Box
                sx={[
                  styles.listItem,
                  game.hasClaimableReward && styles.claimableItem,
                ]}
                className="container"
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "left",
                      overflow: "hidden",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="h6"
                        color="primary"
                        lineHeight={1}
                        sx={{
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          width: "100%",
                        }}
                      >
                        {game.player_name}
                      </Typography>
                      {game.hasClaimableReward && (
                        <Chip
                          icon={<RedeemIcon />}
                          label="CLAIM"
                          color="warning"
                          size="small"
                          sx={{ fontSize: "8px", height: "16px" }}
                          title="Reward available - click to claim"
                        />
                      )}
                      {game.isCheckingClaim && (
                        <Chip
                          label="..."
                          size="small"
                          sx={{ fontSize: "6px", height: "14px", opacity: 0.5 }}
                        />
                      )}
                    </Box>

                    <Typography color="text.secondary">
                      ID: #{game.adventurer_id}
                    </Typography>
                  </Box>
                </Box>

                {game.xp ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      minWidth: "55px",
                    }}
                  >
                    <Typography
                      fontSize="13px"
                      lineHeight={1.2}
                      color="#EDCF33"
                    >
                      Lvl: {calculateLevel(game.xp)}
                    </Typography>
                    <Typography fontSize="13px" lineHeight={1.1}>
                      XP: {game.xp.toLocaleString()}
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    fontSize="13px"
                    color="#EDCF33"
                    flex={1}
                    sx={{ minWidth: "55px" }}
                  >
                    New Game
                  </Typography>
                )}

                <Box sx={styles.actionColumn}>
                  {game.hasClaimableReward && (
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      sx={styles.claimButton}
                      onClick={() => handleClaim(game.adventurer_id)}
                    >
                      <RedeemIcon fontSize="small" />
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={styles.watchButton}
                    onClick={() => handleWatchGame(game.adventurer_id)}
                  >
                    <VisibilityIcon fontSize="small" />
                  </Button>
                </Box>
              </Box>
            </motion.div>
          ))
        )}
      </Box>
    </motion.div>
  );
}

const styles = {
  adventurersHeader: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    mb: 1,
    justifyContent: "space-between",
  },
  backButton: {
    minWidth: "auto",
    px: 1,
  },
  listContainer: {
    width: "100%",
    maxHeight: "365px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    overflowY: "auto",
    pr: 0.5,
  },
  listItem: {
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    padding: "6px !important",
    flexShrink: 0,
    background: "rgba(24, 40, 24, 0.3)",
    border: "1px solid rgba(8, 62, 34, 0.5)",
    borderRadius: "4px",
  },
  claimableItem: {
    border: "2px solid rgba(255, 193, 7, 0.6)",
    background: "rgba(255, 193, 7, 0.1)",
    boxShadow: "0 0 15px rgba(255, 193, 7, 0.3)",
  },
  actionColumn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 0.5,
  },
  claimButton: {
    width: "40px",
    height: "34px",
    fontSize: "12px",
    mr: 0.5,
    background: "linear-gradient(135deg, #ffe082 0%, #ffb300 100%)",
    color: "#1a1a1a",
    boxShadow: "0 0 10px rgba(255, 193, 7, 0.4)",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 0 15px rgba(255, 193, 7, 0.6)",
    },
  },
  watchButton: {
    width: "50px",
    height: "34px",
    fontSize: "12px",
    "&.Mui-disabled": {
      backgroundColor: "rgba(128, 255, 0, 0.1)",
      color: "rgba(128, 255, 0, 0.3)",
      border: "1px solid rgba(128, 255, 0, 0.2)",
    },
  },
};
