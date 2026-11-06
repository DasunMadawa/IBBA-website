import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { SiteShell } from "./components/site/SiteShell";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";


const AdminNewsPage = lazy(() => import("./pages/AdminPublishingPages").then(module => ({ default: module.AdminNewsPage })));
const AdminEventsPage = lazy(() => import("./pages/AdminPublishingPages").then(module => ({ default: module.AdminEventsPage })));
const AdminAccountPage = lazy(() => import("./pages/AdminAccountPage"));
const AdminInquiriesPage = lazy(() => import("./pages/ContactPages").then(module => ({ default: module.AdminInquiriesPage })));
const AdminMediaPage = lazy(() => import("./pages/AdminPages").then(module => ({ default: module.AdminMediaPage })));
const AdminMeetingMinutesPage = lazy(() => import("./pages/AdminPublishingPages").then(module => ({ default: module.AdminMeetingMinutesPage })));
const AdminStudyCirclesPage = lazy(() => import("./pages/AdminPublishingPages").then(module => ({ default: module.AdminStudyCirclesPage })));
const AdminTemplesPage = lazy(() => import("./pages/TemplesPages").then(module => ({ default: module.AdminTemplesPage })));
const LegacyInfoPage = lazy(() => import("./pages/ManagedNewsPages").then(module => ({ default: module.LegacyInfoPage })));
const LegacyMediaPage = lazy(() => import("./pages/ManagedNewsPages").then(module => ({ default: module.LegacyMediaPage })));
const ManagedArticleRoute = lazy(() => import("./pages/ManagedNewsPages").then(module => ({ default: module.ManagedArticleRoute })));
const ManagedNewsMediaPage = lazy(() => import("./pages/ManagedNewsPages").then(module => ({ default: module.ManagedNewsMediaPage })));
const MeetingMinutesDetailPage = lazy(() => import("./pages/MeetingMinutesPublic").then(module => ({ default: module.MeetingMinutesDetailPage })));
const TempleOutreachPage = lazy(() => import("./pages/TempleOutreachPage").then(module => ({ default: module.TempleOutreachPage })));
const TraditionsPage = lazy(() => import("./pages/TraditionsPage"));
const AboutGovernancePage = lazy(() => import("./pages/AboutGovernancePage").then(module => ({ default: module.AboutGovernancePage })));
const AboutPage = lazy(() => import("./pages/PublicPages").then(module => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import("./pages/ContactPages").then(module => ({ default: module.ContactPage })));
const DelegatesPage = lazy(() => import("./pages/PublicPages").then(module => ({ default: module.DelegatesPage })));
const DonatePage = lazy(() => import("./pages/PublicPages").then(module => ({ default: module.DonatePage })));
const EventsPage = lazy(() => import("./pages/PublicPages").then(module => ({ default: module.EventsPage })));
const JoinPage = lazy(() => import("./pages/PublicPages").then(module => ({ default: module.JoinPage })));
const LeadershipPage = lazy(() => import("./pages/PublicPages").then(module => ({ default: module.LeadershipPage })));
const ProgramsPage = lazy(() => import("./pages/PublicPages").then(module => ({ default: module.ProgramsPage })));
const ResourcesPage = lazy(() => import("./pages/PublicPages").then(module => ({ default: module.ResourcesPage })));
const SimpleLegalPage = lazy(() => import("./pages/PublicPages").then(module => ({ default: module.SimpleLegalPage })));
const StudyCirclesPage = lazy(() => import("./pages/PublicPages").then(module => ({ default: module.StudyCirclesPage })));
const TemplesPage = lazy(() => import("./pages/TemplesPages").then(module => ({ default: module.TemplesPage })));
const YouthPage = lazy(() => import("./pages/PublicPages").then(module => ({ default: module.YouthPage })));

function ArticleRoute({ params }: { params: { slug: string } }) {
  return <ManagedArticleRoute slug={params.slug} />;
}

function MediaRoute({ params }: { params: { archiveSlug: string } }) {
  return <LegacyMediaPage archiveSlug={params.archiveSlug} />;
}

function MeetingMinutesRoute({ params }: { params: { slug: string } }) {
  return <MeetingMinutesDetailPage slug={params.slug} />;
}

function PublicRouter() {
  return (
    <SiteShell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={AboutPage} />
        <Route path="/about/history" component={AboutPage} />
        <Route path="/about/mission">{() => <LegacyInfoPage slug="mission" />}</Route>
        <Route path="/about/goals">{() => <LegacyInfoPage slug="goals" />}</Route>
        <Route path="/about/values">{() => <LegacyInfoPage slug="values" />}</Route>
        <Route path="/about/vision">{() => <LegacyInfoPage slug="vision" />}</Route>
        <Route path="/buddhist-traditions" component={TraditionsPage} />
        <Route path="/about/governance" component={AboutGovernancePage} />
        <Route path="/about/directors" component={LeadershipPage} />
        <Route path="/about/governance/officers" component={LeadershipPage} />
        <Route path="/about/governance/advisory-council" component={LeadershipPage} />
        <Route path="/about/governance/dc-liaison" component={LeadershipPage} />
        <Route path="/annual-delegates" component={DelegatesPage} />
        <Route path="/programs" component={ProgramsPage} />
        <Route path="/programs/youth" component={YouthPage} />
        <Route path="/study-circles/minutes/:slug" component={MeetingMinutesRoute} />
        <Route path="/study-circles" component={StudyCirclesPage} />
        <Route path="/temple-outreach" component={TempleOutreachPage} />
        <Route path="/events" component={EventsPage} />
        <Route path="/communities" component={TemplesPage} />
        <Route path="/member-temples" component={TemplesPage} />
        <Route path="/news-media" component={ManagedNewsMediaPage} />
        <Route path="/news/:slug" component={ArticleRoute} />
        <Route path="/media/:archiveSlug" component={MediaRoute} />
        <Route path="/resources" component={ResourcesPage} />
        <Route path="/join" component={JoinPage} />
        <Route path="/donate" component={DonatePage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/unsubscribe">{() => <LegacyInfoPage slug="unsubscribe" />}</Route>
        <Route path="/privacy">{() => <SimpleLegalPage title="Privacy" />}</Route>
        <Route path="/terms-of-use">{() => <SimpleLegalPage title="Terms of Use" />}</Route>
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </SiteShell>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin/inquiries" component={AdminInquiriesPage} />
      <Route path="/admin/account" component={AdminAccountPage} />
      <Route path="/admin/events" component={AdminEventsPage} />
      <Route path="/admin/study-circles" component={AdminStudyCirclesPage} />
      <Route path="/admin/meeting-minutes" component={AdminMeetingMinutesPage} />
      <Route path="/admin/temples" component={AdminTemplesPage} />
      <Route path="/admin/media" component={AdminMediaPage} />
      <Route path="/admin" component={AdminNewsPage} />
      <Route component={PublicRouter} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Suspense fallback={<div className="route-loading" role="status">Loading page…</div>}><Router /></Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
