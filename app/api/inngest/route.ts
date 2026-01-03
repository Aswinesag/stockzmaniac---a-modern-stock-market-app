import { inngest } from '@/lib/inngest/client'
import { sendDailyNewsSummary, sendSignUpEmail, sendWatchlistAlertEmail, sendWeeklyWatchlistSummary } from '@/lib/inngest/functions'
import { serve } from 'inngest/next'

export const { GET, POST, PUT} = serve({
    client: inngest,
    functions: [sendSignUpEmail, sendDailyNewsSummary, sendWatchlistAlertEmail, sendWeeklyWatchlistSummary],
})