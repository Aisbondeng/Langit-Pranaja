import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AudioPlayerProvider } from "./contexts/AudioPlayerContext";
import { LibraryProvider } from "./contexts/LibraryContext";
import { PlaylistProvider } from "./contexts/PlaylistContext";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute, PremiumRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Library from "@/pages/Library";
import Playlists from "@/pages/Playlists";
import Browse from "@/pages/Browse";
import PlaylistDetail from "@/pages/PlaylistDetail";
import AuthPage from "@/pages/auth-page";
import PremiumPage from "@/pages/premium-page";
import AdminPage from "@/pages/admin-page";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NowPlayingBar from "./components/NowPlayingBar";
import MobileNavBar from "./components/MobileNavBar";
import SplashScreen from "./components/SplashScreen";
import { useState, useEffect } from "react";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/library" component={Library} />
      <ProtectedRoute path="/playlists" component={Playlists} />
      <ProtectedRoute path="/browse" component={Browse} />
      <ProtectedRoute path="/playlist/:id" component={PlaylistDetail} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/premium" component={PremiumPage} />
      <ProtectedRoute path="/admin" component={AdminPage} adminOnly={true} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app loading - in a real app this would load initial data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LibraryProvider>
          <PlaylistProvider>
            <AudioPlayerProvider>
              {isLoading ? (
                <SplashScreen />
              ) : (
                <div className="flex flex-col h-screen">
                  <Header />
                  <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto bg-background">
                      <Router />
                    </main>
                  </div>
                  <NowPlayingBar />
                  <MobileNavBar />
                </div>
              )}
              <Toaster />
            </AudioPlayerProvider>
          </PlaylistProvider>
        </LibraryProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
