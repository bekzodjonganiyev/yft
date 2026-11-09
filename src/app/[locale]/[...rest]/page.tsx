import { notFound } from "next/navigation";

// Any unknown path inside a language (/uz/whatever) renders that language's not-found page.
export default function CatchAll() {
  notFound();
}
