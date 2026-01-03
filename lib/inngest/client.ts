import { Inngest } from 'inngest';

export const inngest = new Inngest({
    id: 'stockzmaniac',
    ai: { gemini: { apiKey: process.env.GEMINI_API_KEY! }}
})
await inngest.send({
  name: "app/production.test",
  data: { ok: true }
});
