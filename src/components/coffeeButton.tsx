import { Image } from '@/components/ui/image';
import Link from 'next/link';

/* eslint-disable @next/next/no-img-element */
export const CoffeeButton = () => (
  <Link
    href="https://www.buymeacoffee.com/utlandingur"
    role="button"
    aria-label="Buy me a coffee"
    target="_blank"
  >
    <Image
      src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=utlandingur&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff"
      className="h-9"
      alt="Buy me a coffee button"
      width={235}
      height={50}
    />
  </Link>
);
