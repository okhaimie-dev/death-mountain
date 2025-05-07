import LandingPage from "../pages/StartPage";
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