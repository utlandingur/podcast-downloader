import { Card, CardContent } from '@/components/ui/card';
import { Coffee, Code } from 'lucide-react';
import { GithubIcon } from '../components/ui/icons/githubIcon';

import Link from 'next/link';
import { CoffeeButton } from './coffeeButton';
import { Button } from './ui/button';

export function Support() {
  return (
    <section className="container grid gap-12">
      <h2>Support the project</h2>
      <Card className="mx-auto">
        <CardContent className="flex flex-col items-center space-y-6 p-6 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Coffee className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Donate</h3>
            <p className="text-muted-foreground">
              If you love this site, please consider buying me a coffee. It
              helps pay the bills and keeps me motivated.
            </p>
          </div>
          <CoffeeButton />
        </CardContent>
      </Card>
      <Card className="mx-auto">
        <CardContent className="flex flex-col items-center space-y-6 p-6 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Code className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Contribute</h3>
            <p className="text-muted-foreground">
              The site is completely open source. If you want to help out,
              please create a pull request or open an issue on GitHub.
            </p>
          </div>
          <Button
            className="flex justify-center mx-auto max-w-[600px]"
            variant={'secondary'}
          >
            <GithubIcon />
            <Link
              href="https://github.com/utlandingur/podcast-downloader"
              target="_blank"
            >
              View the code
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
