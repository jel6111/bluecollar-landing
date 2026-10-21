import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

type Props = {
  location: "header" | "hero" | "preview" | "bottom";
  size?: "default" | "lg";
  className?: string;
  label?: string;
};

export default function CtaButton({
  location,
  size = "lg",
  className,
  label = "작업기록 체험하기",
}: Props) {
  return (
    <Button asChild size={size} className={className}>
      <Link href={SITE.recordsPath} data-location={location}>
        {label} <span aria-hidden="true">→</span>
      </Link>
    </Button>
  );
}
