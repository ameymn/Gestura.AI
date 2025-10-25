import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4 rounded-xl">
        <CardContent className="pt-6 p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-heading text-foreground">
              404 - Page Not Found
            </h1>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist.
            </p>
          </div>

          <Link href="/">
            <Button className="gap-2" data-testid="button-home">
              <Home className="w-4 h-4" />
              Go to Sensor Page
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
