import GamePage from "../pages/GamePage";
import LandingPage from "../pages/StartPage";

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