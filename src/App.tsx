import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { ScrollToTop } from "@/components/shared/ScrollToTop";

// Every route is code-split so crawlers and first-time visitors only download
// what they need; App-level providers stay in the main bundle.
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Team = lazy(() => import("./pages/Team"));
const LisbonPilot = lazy(() => import("./pages/LisbonPilot"));
const MovementPlanner = lazy(() => import("./pages/MovementPlanner"));
const Movements = lazy(() => import("./pages/Movements"));
const BunnyChallenge = lazy(() => import("./pages/BunnyChallenge"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div
    className="flex min-h-[60vh] items-center justify-center"
    role="status"
    aria-live="polite"
  >
    <span className="sr-only">Loading…</span>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/teams" element={<Navigate to="/team" replace />} />
            <Route path="/lisbon-pilot" element={<LisbonPilot />} />
            <Route path="/movement-planner" element={<MovementPlanner />} />
            <Route path="/movements" element={<Movements />} />
            <Route path="/bunny-challenge" element={<BunnyChallenge />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/terms-and-privacy" element={<Navigate to="/terms" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <LanguageSwitcher />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
