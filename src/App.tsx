import { ThemeProvider } from './features/theme/state/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "@features/auth/pages/LoginPage";
import SignupPage from "@features/auth/pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import { ChatProvider } from './features/chat/state/ChatContext';
import { Sidebar } from './app/Sidebar';
import { Chat } from '@features/chat/components/Chat';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Router basename={import.meta.env.PROD ? '/Graphite' : ''}>
        <Routes>
          <Route path="/" element={
            <ChatProvider>
              <div style={{ display: "flex", flexDirection: "row", height: "100vh", width: "100vw", overflow: "hidden" }}>
                <Sidebar />
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
                  <main style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                    <Chat id={"main"} initialMessages={[]} />
                  </main>
                </div>
              </div>
            </ChatProvider>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
