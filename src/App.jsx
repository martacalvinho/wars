import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme } from './styles/theme';
import { UserProvider } from './context/UserContext';
import { WalletContextProvider } from './context/WalletContext';
import HomePage from './pages/HomePage';
import BattlePage from './pages/BattlePage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import Navigation from './components/Navigation';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <WalletContextProvider>
        <UserProvider>
          <GlobalStyles />
          <Router>
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/battle" element={<BattlePage />} />
              <Route path="/battle/active" element={<BattlePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
            </Routes>
          </Router>
        </UserProvider>
      </WalletContextProvider>
    </ThemeProvider>
  );
}

export default App;