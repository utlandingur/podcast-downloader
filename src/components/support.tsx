import { Card, CardContent } from "@/components/ui/card";
import { Coffee } from "lucide-react";
import { CoffeeButton } from "./coffeeButton";

export function Support() {
  return (
    <section className="container">
      <Card className="mx-auto max-w-2xl">
        <CardContent className="flex flex-col items-center space-y-6 p-6 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Coffee className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Support the Project</h3>
            <p className="text-muted-foreground">
              If you love this site, please consider buying me a coffee. It
              helps pay the bills and keeps me motivated.
            </p>
          </div>
          <CoffeeButton />
        </CardContent>
      </Card>
    </section>
  );
}
