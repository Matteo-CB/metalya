import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none dark:prose-invert",
        "prose-headings:font-serif prose-headings:font-medium",
        "prose-a:text-neutral-900 prose-a:underline prose-a:underline-offset-4 hover:prose-a:decoration-neutral-400",
        "prose-img:rounded-lg",
        className
      )}
    >
      <ReactMarkdown
        components={{
          img: ({ node, ...props }) => {
            const { src, alt } = props;

            if (!src || typeof src !== "string") return null;

            const isVideo = src.endsWith(".mp4") || src.endsWith(".webm");

            if (isVideo) {
              return (
                <video
                  controls
                  className="my-8 w-full rounded-lg shadow-sm"
                  preload="metadata"
                  loop
                  playsInline
                >
                  <source src={src} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              );
            }

            return (
              <span className="relative my-8 block aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 shadow-sm">
                <Image
                  src={src}
                  alt={alt || "Image de l'article"}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                />
              </span>
            );
          },
          a: ({ node, href, children, ...props }) => {
            const isExternal = href?.startsWith("http");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
