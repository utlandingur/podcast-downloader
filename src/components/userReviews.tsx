import { Card, CardContent } from "@/components/ui/card";
import { Coffee } from "lucide-react";

export function UserReviews() {
  const reviews = [
    {
      text: "Thank you so much for this tool! I hope it'll be around for years to come.",
      author: "OhLordyA",
      source: "BuyMeACoffee",
    },
    {
      text: "Thank you so much! after scouring the internet, you solved my problem in less than a minute!",
      author: "K. V",
      source: "BuyMeACoffee",
    },
    {
      text: "Thanks so much for this. I was looking for a simple way to look up my shows and download episodes as files that I can put onto an old iPhone that I use purely for offline music and podcasts. This is great!",
      author: "Tom Prior",
      source: "BuyMeACoffee",
    },
    {
      text: "Thanks for creating and sharing this. It's really helpful and means that I can download history podcast episodes for my elderly father to listen to in the car via USB stick (he is beyond using bluetooth devices and/or podcasts on his phone :)",
      author: "Em",
      source: "BuyMeACoffee",
    },
  ];

  return (
    <section className="container">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter">
            What Our Supporters Say
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4 bg-primary-foreground h-full flex flex-col justify-between">
                <div className="flex flex-col  justify-center gap-4 items-center">
                  <div className="flex text-accent-foreground">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Coffee key={j} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">{review.text}</p>
                </div>
                <div>
                  <p className="font-semibold">{review.author}</p>
                  {review.source && (
                    <p className="text-xs text-muted-foreground">
                      Source: {review.source}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
