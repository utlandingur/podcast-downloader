import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqItems = [
    {
      question: "How do I download a podcast as an MP3?",
      answer:
        "Simply search for your favorite podcast in the search bar above, select an episode, and download it directly as an MP3 file. The process is seamless, straightforward, and compatible with most devices.",
    },
    {
      question: "What happens if there is an error while downloading?",
      answer:
        'If there is an issue, the episode will open in a new browser tab. Just click the ellipsis menu in the player and hit "Download" to save the file.',
    },
    {
      question: "Is PodcastToMp3.com free?",
      answer:
        "Yes, our service is completely free to use! No hidden fees or subscriptions required.",
    },
    {
      question: "Do you host podcast files on your servers?",
      answer:
        "No, we don't host or serve any files. Downloads are facilitated directly from the original podcast source for a reliable and secure experience.",
    },
  ];

  return (
    <section className="container">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
