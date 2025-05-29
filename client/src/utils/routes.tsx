import LandingPage from "../pages/StartPage";
import GamePage from "../pages/GamePage";
import WatchPage from "../pages/WatchPage";
import CampaignPage from "../pages/CampaignPage";

export const routes = [
  {
    path: '/',
    content: <LandingPage />
  },
  {
    path: '/play',
    content: <GamePage />
  },
  {
    path: '/watch',
    content: <WatchPage />
  },
  {
    path: '/campaign',
    content: <CampaignPage />
  }
]