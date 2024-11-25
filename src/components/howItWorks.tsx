import { cn } from "@/lib/utils";

export const HowItWorks = () => {
  return (
    <div className={cn("flex flex-col gap-8")}>
      <section id="faq" className={cn("m-y-2")}>
        <h2>FAQs</h2>
        <div className={cn("flex flex-col gap-8")}>
          <div>
            <h3>How do I download a podcast as an MP3?</h3>
            <p>
              Simply search for your favorite podcast in the search bar above,
              select an episode, and download it directly as an MP3 file. The
              process is seamless and straightforward.
            </p>
          </div>
          <div>
            <h3>What happens if there is an error while downloading?</h3>
            <p>
              If there is an issue, the episode will open in a new browser tab.
              Just click the ellipsis menu in the player and hit
              &quot;Download&quot; to save the file.
            </p>
          </div>
          <div>
            <h3>Is PodcastToMp3.com free?</h3>
            <p>Yes, our service is completely free to use!</p>
          </div>
          <div>
            <h3>Do you host podcast files on your servers?</h3>
            <p>
              No, we don’t host or serve any files. Downloads are facilitated
              directly from the original podcast source.
            </p>
          </div>
        </div>
      </section>

      <section id="benefits" className={cn("m-y-2")}>
        <h2>Why Use PodcastToMp3.com?</h2>
        <ul className={cn("flex flex-col gap-4 pt-4")}>
          <li>Fast and easy-to-use platform for downloading podcasts.</li>
          <li>
            Direct downloads from the original podcast source ensure security
            and reliability.
          </li>
          <li>Compatible with all devices and players.</li>
          <li>No need to sign up or install any software.</li>
          <li>
            Perfect for offline listening during commutes, workouts, or
            traveling.
          </li>
        </ul>
      </section>
    </div>
  );
};
