import { defineCollection, z } from "astro:content";
import { chapterTimePattern, parseChapterTimeToSeconds } from "../lib/videos";

const seriesSchema = z.string().regex(/^[a-z0-9-]+$/).min(3).max(80).optional();
const seriesOrderSchema = z.number().int().positive().max(200).optional();

const chapterSchema = z.object({
  time: z.string().regex(chapterTimePattern),
  label: z.string().min(2).max(120)
});

const faqSchema = z.object({
  q: z.string().min(6).max(180),
  a: z.string().min(12).max(700)
});

const videos = defineCollection({
  type: "content",
  schema: z
    .object({
      title: z.string().min(8).max(120),
      date: z.coerce.date(),
      lang: z.enum(["fr", "en"]),
      youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
      durationMin: z.number().positive().max(600),
      summary: z.string().min(90).max(300),
      tags: z.array(z.string().min(2).max(40)).min(2).max(8),
      chapters: z.array(chapterSchema).min(2).max(20),
      featuredResourceKeys: z.array(z.string().min(2).max(60)).min(1).max(6),
      faq: z.array(faqSchema).min(2).max(6),
      series: seriesSchema,
      seriesOrder: seriesOrderSchema
    })
    .superRefine((entry, ctx) => {
      const durationSeconds = entry.durationMin * 60;

      if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["durationMin"],
          message: "durationMin must be finite and strictly positive"
        });
      }

      const chapterSeconds = entry.chapters.map((chapter) => parseChapterTimeToSeconds(chapter.time));

      for (let i = 1; i < chapterSeconds.length; i += 1) {
        if (chapterSeconds[i] <= chapterSeconds[i - 1]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["chapters", i, "time"],
            message: "chapter times must be strictly increasing"
          });
        }
      }

      const latestChapter = chapterSeconds[chapterSeconds.length - 1] ?? 0;
      if (latestChapter > durationSeconds) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["chapters"],
          message: "chapter times exceed the stated video duration"
        });
      }

      const uniqueTags = new Set(entry.tags);
      if (uniqueTags.size !== entry.tags.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["tags"],
          message: "tags must be unique"
        });
      }

      const uniqueResources = new Set(entry.featuredResourceKeys);
      if (uniqueResources.size !== entry.featuredResourceKeys.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["featuredResourceKeys"],
          message: "featuredResourceKeys must be unique"
        });
      }

      if ((entry.series && !entry.seriesOrder) || (!entry.series && entry.seriesOrder)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["series"],
          message: "series and seriesOrder must be defined together"
        });
      }
    })
});

const guides = defineCollection({
  type: "content",
  schema: z
    .object({
      title: z.string().min(8).max(120),
      date: z.coerce.date(),
      lang: z.enum(["fr", "en"]),
      summary: z.string().min(90).max(320),
      tags: z.array(z.string().min(2).max(40)).min(2).max(10),
      series: seriesSchema,
      seriesOrder: seriesOrderSchema
    })
    .superRefine((entry, ctx) => {
      const uniqueTags = new Set(entry.tags);
      if (uniqueTags.size !== entry.tags.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["tags"],
          message: "tags must be unique"
        });
      }

      if ((entry.series && !entry.seriesOrder) || (!entry.series && entry.seriesOrder)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["series"],
          message: "series and seriesOrder must be defined together"
        });
      }
    })
});

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().min(8).max(140),
    summary: z.string().min(90).max(340),
    lang: z.enum(["fr", "en"]),
    route: z.string().regex(/^\/(?:[a-z0-9-]+\/)*[a-z0-9-]*\/$/),
    tags: z.array(z.string().min(2).max(40)).min(1).max(16).default([])
  })
});

export const collections = {
  videos,
  guides,
  pages
};
