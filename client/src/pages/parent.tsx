import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, Activity, CheckCircle, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { GestureAnalytics } from "@shared/schema";

export default function ParentDashboard() {
  const { data: analytics, isLoading } = useQuery<GestureAnalytics>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading || !analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const recognitionRate = analytics.totalToday > 0
    ? Math.round((analytics.recognizedCount / analytics.totalToday) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-card-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-primary" data-testid="icon-parent-dashboard" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading text-foreground" data-testid="heading-parent-title">
                Parent Dashboard
              </h1>
              <p className="text-base text-muted-foreground mt-1" data-testid="text-parent-subtitle">
                Track your child's communication progress
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl shadow-md" data-testid="card-metric-total">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-500" />
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    Today
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-bold text-foreground" data-testid="text-total-gestures">
                    {analytics.totalToday}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Gestures
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-md" data-testid="card-metric-recognized">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    Accuracy
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-bold text-foreground" data-testid="text-recognized-count">
                    {analytics.recognizedCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Recognized Gestures
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-md" data-testid="card-metric-rate">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-500" />
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    Rate
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-bold text-foreground" data-testid="text-recognition-rate">
                    {recognitionRate}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Recognition Rate
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-md" data-testid="card-metric-change">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${analytics.percentageChange >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'} flex items-center justify-center`}>
                    {analytics.percentageChange >= 0 ? (
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    Weekly
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className={`text-4xl font-bold ${analytics.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`} data-testid="text-percentage-change">
                    {analytics.percentageChange >= 0 ? '+' : ''}{analytics.percentageChange}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    vs Last Week
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-xl shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold font-heading">
                Weekly Progress
              </CardTitle>
              <CardDescription className="text-base">
                Gesture activity over the past 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full" data-testid="chart-weekly-progress">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics.weeklyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="day"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--primary))"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-md bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Quote className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold font-heading text-foreground">
                    Progress Summary
                  </h3>
                  <p className="text-lg leading-relaxed text-foreground" data-testid="text-summary">
                    {analytics.summary}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Keep encouraging your child's communication efforts. Each gesture represents 
                    their growing confidence and independence in the classroom.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg bg-muted/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">About Gestura</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Gestura empowers students to communicate their needs through personalized gestures, 
                    fostering independence and engagement in the classroom.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Gesture Types</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Wave - Needs Help</li>
                    <li>• Shake - Ready to Answer</li>
                    <li>• Tilt - Wants Break</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Future Features</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    We're working on custom gesture training with ML models to personalize the experience 
                    for each student's unique needs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
