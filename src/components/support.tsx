import { Card, CardContent } from '@/components/ui/card';
import { Code } from 'lucide-react';
import { GithubIcon } from '../components/ui/icons/githubIcon';

import Link from 'next/link';
import { Button } from './ui/button';
import { Donate } from './donate';
import { Container } from '@/components/container';

export function Support() {
  return (
    <section className="w-full">
      <Container className="grid place-items-center gap-12 text-center mx-auto">
        <h2>Support the project</h2>
        <Donate />
        <Card className="mx-auto w-full max-w-3xl">
          <CardContent className="flex flex-col items-center space-y-6 p-6 text-center w-full">
            <div className="rounded-full bg-primary/10 p-3">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Contribute</h3>
              <p>
                The site is completely open source and managed by one person,
                me! If you want to help out, please create a pull request or
                open an issue on GitHub.
              </p>
            </div>
            <Button
              className="flex justify-center mx-auto max-w-[600px]"
              variant={'secondary'}
              type='button'
              asChild
            >
              <Link
                href="https://github.com/utlandingur/podcast-downloader"
                target="_blank"
              >
                <GithubIcon />
                View the code
              </Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
