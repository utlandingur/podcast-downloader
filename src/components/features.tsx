import { Card, CardContent } from "@/components/ui/card";
import { Plane, Shield, History } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <History className="h-6 w-6" />,
      title: "Completely Free",
      description:
        "Enjoy unlimited downloads without paying a cent—no hidden fees, ever.",
    },
    {
      icon: <Plane className="h-6 w-6" />,
      title: "Listen Anywhere, Anytime",
      description:
        "Take your favorite podcasts offline—perfect for flights, road trips, or areas with no internet.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Direct from the Source",
      description:
        "Download episodes directly from podcast hosts for the most secure and reliable experience.",
    },
    {
      icon: <History className="h-6 w-6" />,
      title: "Stay Organized",
      description:
        "Log in with Google to track your downloads, avoid repeats, and keep your library tidy..",
    },
  ];

  return (
    <section className="container">
      <div className="grid gap-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Why Use PodcastToMp3
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 justify-center">
          {features.map((feature, i) => (
            <Card key={i}>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-center text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
