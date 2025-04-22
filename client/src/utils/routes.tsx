import LandingPage from "../pages/LandingPage";
import GamePage from "../pages/GamePage";

export const routes = [
  {
    path: '/',
    content: <LandingPage />
  },
  {
    path: '/play',
    content: <GamePage />
  },
]