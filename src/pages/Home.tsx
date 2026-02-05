import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Map, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="font-semibold">Mangrove Watch Pro</div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/admin_login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/admin_signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Protecting Mangroves with Community and Insight</h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Report, monitor, and resolve incidents impacting mangrove ecosystems. Join the community and make data-driven conservation possible.
            </p>
            <div className="mt-6 flex gap-3">
              <Button size="lg" asChild>
                <Link to="/admin_login">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/admin_signup">Create Account</Link>
              </Button>
            </div>
          </div>
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-border">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Live Reports</span>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Access analytics, incident maps, and community achievements once signed in.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features 3 & 4 */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center">
                    <Map className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">Incident Map</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">Interactive</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Visualize incident hotspots and trends across regions to prioritize response.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/15 flex items-center justify-center">
                    <Award className="h-4 w-4 text-accent" />
                  </div>
                  <span className="font-medium">Achievements & Leaderboard</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">Engaging</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Earn badges for verified reports and climb the leaderboard as you help protect mangroves.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Mangrove Watch Pro
        </div>
      </footer>
    </div>
  );
}
