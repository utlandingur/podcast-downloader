import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Container } from '@/components/container';

export const faqItems = [
  {
    question: 'Is PodcastToMp3.com free?',
    answer:
      'Yes, our service is completely free to use! No hidden fees or subscriptions required.',
  },
  {
    question: 'How do I download a podcast?',
    answer:
      'Simply search for your favorite podcast in the search bar above, select an episode, and click the "Download" button. The file will be saved directly to your device.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No, you don’t need an account to use our service. Just search, download, and enjoy.',
  },
  {
    question: 'How do I download a podcast to my device?',
    answer:
      'For Android, iPhone, or other devices: search for the episode, click "Download", and the file will be saved to your device. You can then transfer it to other devices like Shokz headphones or Yoto Player.',
  },
  {
    question: 'Do I need to install any software?',
    answer:
      'No software installation is required. Everything is web-based, so you can download podcasts directly from your browser.',
  },
  {
    question: 'Can I download Spotify podcasts?',
    answer:
      'Yes. If the podcast is publicly available, you can find it here and download episodes as MP3 files.',
  },
  {
    question: 'Can I download Apple Podcasts to MP3?',
    answer:
      'Yes. Search for any public show and download episodes directly as MP3 files.',
  },
  {
    question: 'What is the maximum file size I can download?',
    answer: 'There is no limit, but larger files may take longer to download.',
  },
  {
    question: 'What formats do you support?',
    answer:
      'We support MP3 format, compatible with most devices and media players.',
  },
  {
    question: 'Do you host podcast files on your servers?',
    answer:
      "No, we don't host files. Downloads are provided directly from the original podcast source for security and reliability.",
  },
];

export function FAQ() {
  return (
    <section className="w-full">
      <Container className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent className="text-left">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
