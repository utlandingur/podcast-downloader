'use client';

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import { Coffee } from "lucide-react";
import { Container } from "./container";

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
  const carouselReviews = [...reviews, ...reviews];

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_60%)]" />
      <div className="space-y-10">
        <Container className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter">
            What Our Supporters Say
          </h2>
          <p className="text-muted-foreground">
            Real feedback from listeners who download on the go.
          </p>
        </Container>

        <Carousel
          opts={{ align: "start", loop: true, dragFree: true }}
          plugins={[
            AutoScroll({
              speed: 0.8,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {carouselReviews.map((review, i) => (
              <CarouselItem
                key={`${review.author}-${i}`}
                className="pl-4 basis-[280px] sm:basis-[320px] lg:basis-[360px]"
              >
                <Card className="h-full border-border/60 bg-background/70 shadow-sm backdrop-blur">
                  <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="flex text-accent-foreground">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Coffee key={j} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.text}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{review.author}</p>
                      {review.source && (
                        <p className="text-xs text-muted-foreground">
                          Source: {review.source}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-20 bg-gradient-to-r from-background to-transparent md:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-20 bg-gradient-to-l from-background to-transparent md:block" />
    </section>
  );
}
