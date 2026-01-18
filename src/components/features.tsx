import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/container";
import { Plane, Shield, History, DownloadCloud } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <History className="h-6 w-6" />,
      title: "Completely Free",
      description:
        "Enjoy unlimited downloads without paying a cent—no hidden fees, ever.",
    },
    {
      icon: <DownloadCloud className="h-6 w-6" />,
      title: "Bulk Downloads",
      description:
        "Grab full seasons or multi-episode batches in one go when you need a lot fast.",
    },
    {
      icon: <Plane className="h-6 w-6" />,
      title: "No Ads or Tracking",
      description:
        "Download what you want without ads, trackers, or upsells—just a clean, fast experience.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Direct from the Source",
      description:
        "Download episodes directly from podcast hosts for the most secure and reliable experience.",
    },
  ];

  return (
    <section className="w-full">
      <Container className="grid gap-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Why Use PodcastToMp3.com
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
      </Container>
    </section>
  );
}
