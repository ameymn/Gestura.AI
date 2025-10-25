import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Smartphone, GraduationCap, Users } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Sensor", icon: Smartphone, testId: "link-nav-sensor" },
    { path: "/teacher", label: "Teacher", icon: GraduationCap, testId: "link-nav-teacher" },
    { path: "/parent", label: "Parent", icon: Users, testId: "link-nav-parent" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50" data-testid="nav-main">
      <div className="bg-card/95 backdrop-blur-md border border-card-border rounded-full shadow-lg px-2 py-2 flex items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <Link key={item.path} href={item.path} data-testid={item.testId}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className="rounded-full min-h-9 px-4 gap-2"
                data-testid={`button-${item.testId}`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
