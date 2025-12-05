import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { cn } from "@/lib/utils";
import remarkBreaks from "remark-breaks";
import { CopyButton } from "./copy-button";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-lg prose-neutral max-w-none dark:prose-invert",
        "prose-headings:font-serif prose-headings:font-medium prose-headings:text-neutral-900 prose-headings:scroll-mt-32",
        "prose-p:text-neutral-700 prose-p:leading-8 prose-p:font-sans",
        "prose-strong:font-bold prose-strong:text-neutral-900",
        "prose-a:text-indigo-600 prose-a:font-medium prose-a:no-underline prose-a:border-b prose-a:border-indigo-200 hover:prose-a:border-indigo-600 hover:prose-a:text-indigo-800 transition-all",
        "prose-li:text-neutral-700 prose-li:marker:text-indigo-400",
        "prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-10",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        components={{
          // --- CORRECTION BR (Utiliser span block au lieu de div) ---
          br: () => <span className="block h-4 content-['']" />,

          hr: () => (
            <div className="my-16 flex items-center justify-center gap-4">
              <span className="h-px w-24 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
              <span className="text-neutral-300">✦</span>
              <span className="h-px w-24 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
            </div>
          ),

          h2: ({ node, children, ...props }) => {
            const text = String(children).replace(/<[^>]*>/g, "");
            const id = slugify(text);
            return (
              <h2
                id={id}
                className="mt-16 mb-8 text-3xl md:text-4xl font-serif tracking-tight text-neutral-900 border-l-4 border-indigo-500 pl-6 py-1"
                {...props}
              >
                {children}
              </h2>
            );
          },

          h3: ({ node, children, ...props }) => {
            const text = String(children).replace(/<[^>]*>/g, "");
            const id = slugify(text);
            return (
              <h3
                id={id}
                className="mt-12 mb-6 text-2xl font-serif font-semibold text-neutral-800"
                {...props}
              >
                {children}
              </h3>
            );
          },

          p: ({ node, children, ...props }) => {
            const hasBlockChild =
              node &&
              node.children.some(
                (child) =>
                  child.type === "element" &&
                  (child.tagName === "img" ||
                    child.tagName === "figure" ||
                    child.tagName === "div")
              );

            if (hasBlockChild) {
              return <div className="mb-8">{children}</div>;
            }

            return (
              <p
                className="mb-8 text-lg md:text-xl leading-relaxed text-neutral-600 font-light"
                {...props}
              >
                {children}
              </p>
            );
          },

          ul: ({ node, children, ...props }) => (
            <ul className="my-8 space-y-3 list-none pl-0" {...props}>
              {children}
            </ul>
          ),

          li: ({ node, children, ...props }) => (
            <li
              className="flex items-start gap-3 text-lg text-neutral-700"
              {...props}
            >
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              <span className="leading-relaxed">{children}</span>
            </li>
          ),

          blockquote: ({ node, children, ...props }) => {
            return (
              <div className="my-10 relative overflow-hidden rounded-2xl bg-indigo-50 p-8 md:p-10 border-l-4 border-indigo-500">
                <blockquote className="font-serif text-xl font-medium italic text-indigo-900 md:text-2xl leading-relaxed">
                  {children}
                </blockquote>
              </div>
            );
          },

          img: ({ node, ...props }) => {
            const { src, alt } = props;

            if (!src || typeof src !== "string") return null;

            const isVideo = src.endsWith(".mp4") || src.endsWith(".webm");

            if (isVideo) {
              return (
                <figure className="my-12 block w-full">
                  <video
                    controls
                    className="w-full rounded-2xl shadow-xl border border-neutral-100"
                    preload="metadata"
                    loop
                    playsInline
                  >
                    <source src={src} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                  {alt && (
                    <figcaption className="mt-3 text-center text-sm font-medium text-neutral-400 italic">
                      {alt}
                    </figcaption>
                  )}
                </figure>
              );
            }

            return (
              <figure className="my-12 relative block w-full">
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-neutral-900/5">
                  <Image
                    src={src}
                    alt={alt || "Illustration"}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                  />
                </div>
                {alt && (
                  <figcaption className="mt-4 flex items-center justify-center gap-2 text-sm text-neutral-500">
                    <span className="h-px w-8 bg-neutral-200" />
                    <span className="italic">{alt}</span>
                    <span className="h-px w-8 bg-neutral-200" />
                  </figcaption>
                )}
              </figure>
            );
          },

          a: ({ node, href, children, ...props }) => {
            const isExternal = href?.startsWith("http");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group relative inline-block font-bold text-neutral-900 transition-colors hover:text-indigo-600"
                {...props}
              >
                {children}
                <span className="absolute bottom-0 left-0 h-px w-full bg-indigo-200 transition-all duration-300 group-hover:h-[2px] group-hover:bg-indigo-600" />
              </a>
            );
          },

          code: ({ node, className, children, ...props }) => {
            // @ts-ignore
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;
            const codeContent = String(children).replace(/\n$/, "");

            if (isInline) {
              return (
                <code
                  className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-sm font-bold text-indigo-600 border border-neutral-200"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="relative my-8 overflow-hidden rounded-xl bg-neutral-900 shadow-2xl ring-1 ring-white/10">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500/80" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                      <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                      {match ? match[1] : "Code"}
                    </span>
                  </div>
                  <CopyButton content={codeContent} />
                </div>
                <div className="overflow-x-auto p-6">
                  <code
                    className={cn(
                      "font-mono text-sm text-neutral-200",
                      className
                    )}
                    {...props}
                  >
                    {children}
                  </code>
                </div>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
