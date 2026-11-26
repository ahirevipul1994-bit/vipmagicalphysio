import { type ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { I18nProvider } from '@/lib/i18n';
import { PublicShell } from '@/components/site';
import { HomePage, AboutPage, ServicesPage, ServiceDetailPage, EducationPage, BlogPage, EbooksPage, FaqsPage, ContactPage, BookPage, PolicyPage, VideosPage } from '@/pages/public';
import { AdminPage, AdminAuthProvider } from '@/pages/admin';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 15000, refetchOnWindowFocus: true, refetchInterval: 60000 } } });

function Router() {
  const [loc] = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [loc]);
  if (loc === '/admin' || loc.startsWith('/admin/')) return <RoutedErrorBoundary><AdminPage /></RoutedErrorBoundary>;
  return (
    <PublicShell>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/services" component={ServicesPage} />
          <Route path="/services/:slug" component={ServiceDetailPage} />
          <Route path="/education/pain">{() => <EducationPage topic="pain" />}</Route>
          <Route path="/education/exercise">{() => <EducationPage topic="exercise" />}</Route>
          <Route path="/education/healthy-ageing">{() => <EducationPage topic="healthy-ageing" />}</Route>
          <Route path="/blog" component={BlogPage} />
          <Route path="/videos" component={VideosPage} />
          <Route path="/ebooks" component={EbooksPage} />
          <Route path="/faqs" component={FaqsPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/book" component={BookPage} />
          <Route path="/privacy">{() => <PolicyPage name="privacy" />}</Route>
          <Route path="/terms">{() => <PolicyPage name="terms" />}</Route>
          <Route path="/refund">{() => <PolicyPage name="refund" />}</Route>
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </PublicShell>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <I18nProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <IdentityRouter />
          </WouterRouter>
        </I18nProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function IdentityRouter() {
  const [location, navigate] = useLocation();
  const callback = /(?:^#|&)(?:invite_token|recovery_token|confirmation_token|email_change_token)=/.test(window.location.hash);
  useEffect(() => {
    if (callback && location !== '/admin' && !location.startsWith('/admin/')) {
      navigate(`/admin${window.location.hash}`, { replace: true });
    }
  }, [callback, location, navigate]);
  return location === '/admin' || location.startsWith('/admin/')
    ? <AdminAuthProvider><Router /></AdminAuthProvider>
    : <Router />;
}

export default App;
