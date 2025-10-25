import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Volume2, Hand, Coffee, MessageCircle, Activity } from "lucide-react";
import type { Gesture } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-cyan-500",
];

const GESTURE_ICONS = {
  wave: Hand,
  shake: MessageCircle,
  tilt: Coffee,
};

const GESTURE_COLORS = {
  wave: "bg-red-500",
  shake: "bg-blue-500",
  tilt: "bg-green-500",
};

export default function TeacherDashboard() {
  const [realtimeGestures, setRealtimeGestures] = useState<Gesture[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const announcedGesturesRef = useRef<Set<string>>(new Set());

  const { data: todayGestures = [] } = useQuery<Gesture[]>({
    queryKey: ["/api/gestures/today"],
  });

  const speakMessage = (studentName: string, message: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      `${studentName} says: ${message}`
    );
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'gesture') {
          const gesture = message.data as Gesture;
          
          if (!announcedGesturesRef.current.has(gesture.id)) {
            announcedGesturesRef.current.add(gesture.id);
            speakMessage(gesture.studentName, gesture.message);
            
            setRealtimeGestures((prev) => {
              const newGestures = [gesture, ...prev].slice(0, 5);
              return newGestures;
            });

            setTimeout(() => {
              setRealtimeGestures((prev) => prev.filter((g) => g.id !== gesture.id));
            }, 10000);
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    socket.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    wsRef.current = socket;

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const index = name.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  };

  const formatTime = (timestamp: string | Date) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-card-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="w-6 h-6 text-primary" data-testid="icon-dashboard-bell" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading text-foreground" data-testid="heading-teacher-title">
                  Teacher Dashboard
                </h1>
                <p className="text-sm text-muted-foreground" data-testid="text-teacher-subtitle">
                  Real-time student communication
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={isConnected ? "default" : "secondary"}
                className="flex items-center gap-1.5"
                data-testid="badge-websocket-status"
              >
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-white animate-pulse' : 'bg-muted-foreground'}`} />
                {isConnected ? 'Live' : 'Disconnected'}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1.5" data-testid="badge-gesture-count">
                <Activity className="w-3 h-3" />
                {todayGestures.length} today
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold font-heading text-foreground" data-testid="heading-live-notifications">
                Live Notifications
              </h2>
              <Volume2 className="w-5 h-5 text-muted-foreground" data-testid="icon-volume-tts" />
            </div>

            {realtimeGestures.length === 0 ? (
              <Card className="rounded-xl" data-testid="card-empty-state">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Waiting for gestures
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Students can send gestures using their mobile devices. 
                    Notifications will appear here in real-time with voice announcements.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {realtimeGestures.map((gesture) => {
                  const GestureIcon = GESTURE_ICONS[gesture.gestureType as keyof typeof GESTURE_ICONS] || Hand;
                  const gestureColor = GESTURE_COLORS[gesture.gestureType as keyof typeof GESTURE_COLORS] || "bg-gray-500";
                  
                  return (
                    <Card
                      key={gesture.id}
                      className="rounded-xl animate-in slide-in-from-right-5 fade-in duration-300 shadow-md"
                      data-testid={`card-notification-${gesture.id}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className={`${getAvatarColor(gesture.studentName)} w-14 h-14 flex-shrink-0`}>
                            <AvatarFallback className="text-white text-lg font-semibold">
                              {getInitials(gesture.studentName)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="text-2xl font-bold text-foreground" data-testid={`text-student-name-${gesture.id}`}>
                                {gesture.studentName}
                              </h3>
                              <Badge className={`${gestureColor} text-white rounded-full`} data-testid={`badge-gesture-type-${gesture.id}`}>
                                <GestureIcon className="w-3 h-3 mr-1" />
                                {gesture.gestureType}
                              </Badge>
                            </div>
                            
                            <p className="text-xl font-medium text-foreground mb-2" data-testid={`text-message-${gesture.id}`}>
                              {gesture.message}
                            </p>
                            
                            <p className="text-sm text-muted-foreground" data-testid={`text-timestamp-${gesture.id}`}>
                              {formatTime(gesture.timestamp)}
                            </p>
                          </div>

                          <Volume2 className="w-6 h-6 text-primary flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold font-heading text-foreground">
              Today's Activity
            </h2>

            <Card className="rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Recent Gestures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {todayGestures.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No gestures received today
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {todayGestures.map((gesture) => {
                        const GestureIcon = GESTURE_ICONS[gesture.gestureType as keyof typeof GESTURE_ICONS] || Hand;
                        
                        return (
                          <Card key={gesture.id} className="rounded-lg p-4 hover-elevate" data-testid={`card-history-${gesture.id}`}>
                            <div className="flex items-center gap-3">
                              <Avatar className={`${getAvatarColor(gesture.studentName)} w-10 h-10`}>
                                <AvatarFallback className="text-white text-sm font-semibold">
                                  {getInitials(gesture.studentName)}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-foreground truncate">
                                  {gesture.studentName}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {gesture.message}
                                </p>
                              </div>

                              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                <GestureIcon className="w-4 h-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(gesture.timestamp)}
                                </span>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
