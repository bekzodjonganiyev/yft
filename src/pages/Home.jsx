import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Hero } from "../components/Hero";
import { Brands } from "../components/Brands";
import { About } from "../components/About";
import { Process } from "../components/Process";
import { GalleryPreview } from "../components/GalleryPreview";
import { Contact } from "../components/Contact";

export function Home() {
  const navigate = useNavigate();
  const nameInputRef = useRef(null);
  const [brand, setBrand] = useState("");

  // "Request a price" under a bag: preselect that brand, go to the form, start typing.
  const requestPrice = (brandId) => {
    setBrand(brandId);
    navigate({ hash: "#contact" });
    nameInputRef.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <Hero />
      <Brands onRequestPrice={requestPrice} />
      <About />
      <Process />
      <GalleryPreview />
      <Contact ref={nameInputRef} brand={brand} onBrandChange={setBrand} />
    </>
  );
}
