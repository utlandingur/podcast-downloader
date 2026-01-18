import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/container";
import { Download, Search } from "lucide-react";

export function HowItWorks() {
  return (
    <section className="w-full">
      <Container className="grid gap-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-muted-foreground">
            Download your favorite podcasts in just two simple steps
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="flex flex-col items-center space-y-4 p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">1. Search</h3>
              <p className="text-center text-muted-foreground">
                Type the name of the podcast into the searchbar and select the right result.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center space-y-4 p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">2. Download</h3>
              <p className="text-center text-muted-foreground">
                Download episodes directly from the podcast’s original source
                with one click or click the three dots in the player that
                appears.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
