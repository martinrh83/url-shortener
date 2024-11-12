import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [longUrl, setLongUrl] = useState();
  const navigate = useNavigate();

  function handleShorten(e) {
    e.preventDefault();
    if (longUrl) navigate(`auth?createNew=${longUrl}`);
  }
  return (
    <div className="flex flex-col items-center">
      <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
        The only URL Shortener <br /> you&rsquo;ll ever need!{" "}
      </h2>
      <form
        className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2"
        onSubmit={handleShorten}
      >
        <Input
          type="url"
          value={longUrl}
          placeholder="Enter your loong URL"
          className="h-full flex-1 py-4 px-4"
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <Button className="h-full" type="submit" variant="destructive">
          Shorten!
        </Button>
      </form>
      <Accordion type="multiple" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>How does the URL shortener works?</AccordionTrigger>
          <AccordionContent>
            When you enter a long URL, our system generates a shorten version of
            that URL. This shortened URL redirects to the original long URL when
            accesed.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
