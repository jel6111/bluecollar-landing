"use client";

import { Button } from "@/components/ui/button";

export default function SectionJump() {
  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
    >
      사용 방법 보기 <span aria-hidden="true">↓</span>
    </Button>
  );
}
