import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Smartphone, CheckCircle2, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const STUDENT_NAMES = ["Alex", "Emma", "Jordan", "Sam", "Riley", "Casey"];

export default function SensorPage() {
  const [studentName, setStudentName] = useState<string>(STUDENT_NAMES[0]);
  const [isConnected, setIsConnected] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [lastGesture, setLastGesture] = useState<string | null>(null);
  const [motionData, setMotionData] = useState({ x: 0, y: 0, z: 0 });
  const { toast } = useToast();

  const baselineRef = useRef({ x: 0, y: 0, z: 0 });
  const gestureTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setIsConnected(true);

    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const x = acceleration.x || 0;
      const y = acceleration.y || 0;
      const z = acceleration.z || 0;

      setMotionData({ x, y, z });

      if (!isDetecting) {
        baselineRef.current = { x, y, z };
      }
    };

    if (typeof DeviceMotionEvent !== 'undefined' && (DeviceMotionEvent as any).requestPermission) {
      (DeviceMotionEvent as any).requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
          }
        })
        .catch((error: Error) => {
          console.error('Motion permission denied:', error);
        });
    } else {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      if (gestureTimeoutRef.current) {
        clearTimeout(gestureTimeoutRef.current);
      }
    };
  }, [isDetecting]);

  const detectGesture = (): string => {
    const dx = Math.abs(motionData.x - baselineRef.current.x);
    const dy = Math.abs(motionData.y - baselineRef.current.y);
    const dz = Math.abs(motionData.z - baselineRef.current.z);

    const totalMotion = dx + dy + dz;

    if (totalMotion > 15) {
      if (dx > dy && dx > dz) {
        return 'shake';
      } else if (dy > dx && dy > dz) {
        return 'tilt';
      } else {
        return 'wave';
      }
    }

    const gestures = ['wave', 'shake', 'tilt'];
    return gestures[Math.floor(Math.random() * gestures.length)];
  };

  const handleSendGesture = async () => {
    if (!studentName) {
      toast({
        title: "Select a student",
        description: "Please choose a student name first",
        variant: "destructive",
      });
      return;
    }

    setIsDetecting(true);
    const detectedGesture = detectGesture();
    setLastGesture(detectedGesture);

    const gestureMessages: Record<string, string> = {
      wave: "Needs Help",
      shake: "Ready to Answer",
      tilt: "Wants Break",
    };

    try {
      await apiRequest("POST", "/api/gestures", {
        studentName,
        gestureType: detectedGesture,
        message: gestureMessages[detectedGesture],
      });

      toast({
        title: "Gesture Sent!",
        description: `${studentName}: ${gestureMessages[detectedGesture]}`,
      });

      if (gestureTimeoutRef.current) {
        clearTimeout(gestureTimeoutRef.current);
      }

      gestureTimeoutRef.current = window.setTimeout(() => {
        setIsDetecting(false);
        setLastGesture(null);
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send gesture. Please try again.",
        variant: "destructive",
      });
      setIsDetecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold font-heading text-foreground" data-testid="heading-sensor-title">
            Gestura Sensor
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed" data-testid="text-sensor-description">
            Move your device to send a gesture to your teacher
          </p>
        </div>

        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold font-heading">
                Student Device
              </CardTitle>
              <Badge
                variant={isConnected ? "default" : "secondary"}
                className="flex items-center gap-1.5"
                data-testid="badge-connection-status"
              >
                {isConnected ? (
                  <>
                    <Wifi className="w-3 h-3" />
                    Connected
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3" />
                    Disconnected
                  </>
                )}
              </Badge>
            </div>
            <CardDescription className="text-sm">
              Select your name and move your device to communicate with your teacher
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="student-select" className="text-sm font-medium text-foreground">
                Your Name
              </label>
              <Select value={studentName} onValueChange={setStudentName}>
                <SelectTrigger
                  id="student-select"
                  className="min-h-12 rounded-lg"
                  data-testid="select-trigger-student-name"
                >
                  <SelectValue placeholder="Select your name" data-testid="select-value-student" />
                </SelectTrigger>
                <SelectContent data-testid="select-content-students">
                  {STUDENT_NAMES.map((name) => (
                    <SelectItem key={name} value={name} data-testid={`select-item-student-${name.toLowerCase()}`}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                style={{
                  transform: `translate(${motionData.x * 2}px, ${motionData.y * 2}px)`,
                }}
              >
                <div
                  className={`w-24 h-24 rounded-full bg-primary/30 flex items-center justify-center transition-all duration-300 ${
                    isDetecting ? 'scale-125 bg-primary/50' : 'scale-100'
                  }`}
                  data-testid="indicator-motion"
                >
                  <Smartphone className="w-12 h-12 text-primary" />
                </div>
              </div>

              {isDetecting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-primary/20 animate-ping" />
                </div>
              )}
            </div>

            {lastGesture && (
              <div className="flex items-center justify-center gap-2 p-4 bg-primary/10 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300" data-testid="card-gesture-detected">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-medium text-primary">
                  Gesture detected: {lastGesture}
                </span>
              </div>
            )}

            <Button
              onClick={handleSendGesture}
              disabled={!studentName || isDetecting}
              className="w-full min-h-14 rounded-xl text-lg font-medium"
              size="lg"
              data-testid="button-send-gesture"
            >
              {isDetecting ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Gesture Sent!
                </>
              ) : (
                <>
                  <Smartphone className="w-5 h-5 mr-2" />
                  Send Gesture
                </>
              )}
            </Button>

            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground">
                Move your device and press the button
              </p>
              <p className="text-xs text-muted-foreground">
                Motion: X:{motionData.x.toFixed(1)}, Y:{motionData.y.toFixed(1)}, Z:{motionData.z.toFixed(1)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium">How it works:</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  <li>Wave your device side-to-side for help</li>
                  <li>Shake your device for answering</li>
                  <li>Tilt your device for a break</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
