import { getNews } from "@/lib/actions/finnhub.actions";
import { getAllUsersForNewsEmail, UserForNewsEmail } from "@/lib/actions/user.actions";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { inngest } from "@/lib/inngest/client";
import { getAlertCreatedEmailTemplate, getAlertTriggeredEmailTemplate } from "@/lib/nodemailer/alert-templates";
import { sendEmail } from "@/lib/nodemailer/index";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "@/lib/inngest/prompts";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "@/lib/nodemailer/index";
import { getFormattedTodayDate } from "@/lib/utils";

// Watchlist alert email function
export const sendWatchlistAlertEmail = inngest.createFunction(
  { id: "send-watchlist-alert-email" },
  { cron: "0 9 * * *" }, // Daily at 9 AM
  async ({ step }) => {
    await step.run("get-all-users", async () => {
      const { getAllUsersForNewsEmail } = await import("@/lib/actions/user.actions");
      return await getAllUsersForNewsEmail();
    });

    await step.run("send-watchlist-emails", async () => {
      const { getAllUsersForNewsEmail } = await import("@/lib/actions/user.actions");
      const users = await getAllUsersForNewsEmail();
      const { getWatchlistWithData } = await import("@/lib/actions/watchlist.actions");
      const { getWatchlistAlertEmailTemplate } = await import("@/lib/nodemailer/watchlist-alert-templates");
      
      for (const user of users) {
        const { email, name } = user;
        
        try {
          // Get user's watchlist with detailed data
          const watchlist = await getWatchlistWithData(email);
          
          if (watchlist.length === 0) {
            continue; // Skip users with empty watchlists
          }

          // Calculate watchlist performance metrics
          const totalValue = watchlist.reduce((sum, stock) => sum + (stock.currentPrice || 0), 0);
          const gainers = watchlist.filter(stock => stock.changePercent && stock.changePercent > 0);
          const losers = watchlist.filter(stock => stock.changePercent && stock.changePercent < 0);
          const topGainer = gainers.length > 0 ? gainers.reduce((max, stock) => 
            (stock.changePercent || 0) > (max.changePercent || 0) ? stock : max
          ) : null;
          const topLoser = losers.length > 0 ? losers.reduce((min, stock) => 
            (stock.changePercent || 0) < (min.changePercent || 0) ? stock : min
          ) : null;

          const emailTemplate = getWatchlistAlertEmailTemplate({
            email,
            name: name || 'Trader',
            watchlist,
            totalValue,
            gainersCount: gainers.length,
            losersCount: losers.length,
            topGainer,
            topLoser,
            date: new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
          });
          
          const { sendEmail } = await import("@/lib/nodemailer/index");
          await sendEmail(emailTemplate);
          
        } catch (error) {
          console.error(`Failed to send watchlist alert to ${email}:`, error);
        }
      }
    });
  }
);

// Weekly watchlist summary (more detailed)
export const sendWeeklyWatchlistSummary = inngest.createFunction(
  { id: "send-weekly-watchlist-summary" },
  { cron: "0 9 * * 1" }, // Mondays at 9 AM
  async ({ step }) => {
    await step.run("get-all-users", async () => {
      const { getAllUsersForNewsEmail } = await import("@/lib/actions/user.actions");
      return await getAllUsersForNewsEmail();
    });

    await step.run("send-weekly-summaries", async () => {
      const { getAllUsersForNewsEmail } = await import("@/lib/actions/user.actions");
      const users = await getAllUsersForNewsEmail();
      const { getWatchlistWithData } = await import("@/lib/actions/watchlist.actions");
      const { getWeeklyWatchlistSummaryTemplate } = await import("@/lib/nodemailer/watchlist-alert-templates");
      
      for (const user of users) {
        const { email, name } = user;
        
        try {
          const watchlist = await getWatchlistWithData(email);
          
          if (watchlist.length === 0) {
            continue;
          }

          // Weekly performance analysis
          const weeklyPerformance = watchlist.map(stock => ({
            ...stock,
            weeklyChange: stock.changePercent || 0,
            weeklyValue: (stock.currentPrice || 0) * 100, // Assuming 100 shares
          }));

          const totalWeeklyChange = weeklyPerformance.reduce((sum, stock) => sum + stock.weeklyChange, 0) / watchlist.length;
          const bestPerformer = weeklyPerformance.reduce((best, stock) => 
            stock.weeklyChange > best.weeklyChange ? stock : best
          );
          const worstPerformer = weeklyPerformance.reduce((worst, stock) => 
            stock.weeklyChange < worst.weeklyChange ? stock : worst
          );

          const emailTemplate = getWeeklyWatchlistSummaryTemplate({
            email,
            name: name || 'Trader',
            watchlist: weeklyPerformance,
            totalWeeklyChange,
            bestPerformer,
            worstPerformer,
            weekOf: new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            }),
          });
          
          const { sendEmail } = await import("@/lib/nodemailer/index");
          await sendEmail(emailTemplate);
          
        } catch (error) {
          console.error(`Failed to send weekly summary to ${email}:`, error);
        }
      }
    });
  }
);

export const sendSignUpEmail = inngest.createFunction(
  { id: 'sign-up-email' },
  { event: 'app/user.created' },
  async ({ event, step }) => {

    const user = event.data.user ?? event.data;

    if (!user?.email) {
      throw new Error("Missing user email in event payload");
    }

    const userProfile = `
      - Country: ${user.country ?? "N/A"}
      - Investment goals: ${user.investmentGoals ?? "N/A"}
      - Risk tolerance: ${user.riskTolerance ?? "N/A"}
      - Preferred industry: ${user.preferredIndustry ?? "N/A"}
    `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      '{{userProfile}}',
      userProfile
    );

    const response = await step.ai.infer('generate-welcome-intro', {
      model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
      body: {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      }
    });

    await step.run('send-welcome-email', async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0];
      const introText =
        (part && 'text' in part ? part.text : null) ??
        'Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.';

      return sendWelcomeEmail({
        email: user.email,
        name: user.name ?? "Trader",
        intro: introText,
      });
    });

    return {
      success: true,
      message: 'Welcome email sent successfully',
    };
  }
);


export const sendDailyNewsSummary = inngest.createFunction(
    { id: 'daily-news-summary' },
    [ { event: 'app/send.daily.news' }, { cron: '0 12 * * *' } ],
    async ({ step }) => {
        // Step #1: Get all users for news delivery
        const users = await step.run('get-all-users', getAllUsersForNewsEmail)

        if(!users || users.length === 0) return { success: false, message: 'No users found for news email' };

        // Step #2: For each user, get watchlist symbols -> fetch news (fallback to general)
        const results = await step.run('fetch-user-news', async () => {
            const perUser: Array<{ user: UserForNewsEmail; articles: MarketNewsArticle[] }> = [];
            for (const user of users as UserForNewsEmail[]) {
                try {
                    const symbols = await getWatchlistSymbolsByEmail(user.email);
                    let articles = await getNews(symbols);
                    // Enforce max 6 articles per user
                    articles = (articles || []).slice(0, 6);
                    // If still empty, fallback to general
                    if (!articles || articles.length === 0) {
                        articles = await getNews();
                        articles = (articles || []).slice(0, 6);
                    }
                    perUser.push({ user, articles });
                } catch (e) {
                    console.error('daily-news: error preparing user news', user.email, e);
                    perUser.push({ user, articles: [] });
                }
            }
            return perUser;
        });

        // Step #3: (placeholder) Summarize news via AI
        const userNewsSummaries: { user: UserForNewsEmail; newsContent: string | null }[] = [];

        for (const { user, articles } of results) {
                try {
                    const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(articles, null, 2));

                    const response = await step.ai.infer(`summarize-news-${user.email}`, {
                        model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
                        body: {
                            contents: [{ role: 'user', parts: [{ text:prompt }]}]
                        }
                    });

                    const part = response.candidates?.[0]?.content?.parts?.[0];
                    const newsContent = (part && 'text' in part ? part.text : null) || 'No market news.'

                    userNewsSummaries.push({ user, newsContent });
                } catch (e) {
                    console.error('Failed to summarize news for : ', user.email);
                    userNewsSummaries.push({ user, newsContent: null });
                }
            }

        // Step #4: (placeholder) Send the emails
        await step.run('send-news-emails', async () => {
                await Promise.all(
                    userNewsSummaries.map(async ({ user, newsContent}) => {
                        if(!newsContent) return false;

                        return await sendNewsSummaryEmail({ email: user.email, date: getFormattedTodayDate(), newsContent })
                    })
                )
            })

        return { success: true, message: 'Daily news summary emails sent successfully' }
    }
)