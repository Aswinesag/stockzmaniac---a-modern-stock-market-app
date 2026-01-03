export const getWatchlistAlertEmailTemplate = (data: {
  email: string;
  name: string;
  watchlist: any[];
  totalValue: number;
  gainersCount: number;
  losersCount: number;
  topGainer: any;
  topLoser: any;
  date: string;
}) => ({
  to: data.email,
  subject: `📊 Your Daily Watchlist Update - ${data.date}`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Daily Watchlist Update</title>
        <style type="text/css">
            @media (prefers-color-scheme: dark) {
                .email-container {
                    background-color: #141414 !important;
                    border: 1px solid #30333A !important;
                }
                .dark-bg {
                    background-color: #050505 !important;
                }
                .dark-text {
                    color: #ffffff !important;
                }
                .dark-text-secondary {
                    color: #9ca3af !important;
                }
                .dark-text-muted {
                    color: #6b7280 !important;
                }
                .dark-border {
                    border-color: #30333A !important;
                }
            }
            
            @media only screen and (max-width: 600px) {
                .email-container {
                    width: 100% !important;
                    margin: 0 !important;
                }
                .mobile-padding {
                    padding: 24px !important;
                }
                .mobile-title {
                    font-size: 20px !important;
                }
                .mobile-text {
                    font-size: 14px !important;
                }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #050505;">
            <tr>
                <td align="center" class="mobile-outer-padding" style="padding: 40px 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container" style="max-width: 600px; background-color: #141414; border-radius: 8px; border: 1px solid #30333A;">
                        
                        <!-- Header -->
                        <tr>
                            <td class="mobile-padding" style="padding: 40px 40px 40px 40px;">
                                <h1 class="mobile-title dark-text" style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: #FDD458; line-height: 1.2; text-align: center;">
                                    📊 Daily Watchlist Update
                                </h1>
                                <p class="mobile-text dark-text-muted" style="margin: 0 0 30px 0; font-size: 14px; line-height: 1.4; color: #6b7280; text-align: center;">
                                    Your portfolio performance for ${data.date}
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Summary Stats -->
                        <tr>
                            <td class="mobile-padding" style="padding: 0 40px 40px 40px;">
                            <div style="background-color: #1f2937; padding: 24px; border-radius: 8px; margin-bottom: 20px;">
                                <h2 class="mobile-title dark-text" style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #ffffff;">Portfolio Summary</h2>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 20px;">
                                    <div style="text-align: center;">
                                        <div style="font-size: 28px; font-weight: bold; color: #FDD458;">${data.watchlist.length}</div>
                                        <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">Total Stocks</div>
                                    </div>
                                    <div style="text-align: center;">
                                        <div style="font-size: 28px; font-weight: bold; color: #10b981;">${data.gainersCount}</div>
                                        <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">Gainers</div>
                                    </div>
                                    <div style="text-align: center;">
                                        <div style="font-size: 28px; font-weight: bold; color: #ef4444;">${data.losersCount}</div>
                                        <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">Losers</div>
                                    </div>
                                    <div style="text-align: center;">
                                        <div style="font-size: 28px; font-weight: bold; color: #ffffff;">$${data.totalValue.toFixed(2)}</div>
                                        <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">Total Value</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Top Performers -->
                            ${(data.topGainer || data.topLoser) ? `
                            <div style="background-color: #1f2937; padding: 24px; border-radius: 8px; margin-bottom: 20px;">
                                <h2 class="mobile-title dark-text" style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #ffffff;">Today's Highlights</h2>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                    ${data.topGainer ? `
                                    <div style="background-color: #064e3b; border: 1px solid #10b981; padding: 16px; border-radius: 6px;">
                                        <div style="font-weight: 600; color: #10b981; margin-bottom: 8px; font-size: 14px;">🚀 Top Gainer</div>
                                        <div style="color: #ffffff; font-weight: 500; margin-bottom: 4px;">${data.topGainer.company}</div>
                                        <div style="color: #10b981; font-weight: bold;">${data.topGainer.changeFormatted || '+0.00%'}</div>
                                    </div>
                                    ` : ''}
                                    ${data.topLoser ? `
                                    <div style="background-color: #7f1d1d; border: 1px solid #ef4444; padding: 16px; border-radius: 6px;">
                                        <div style="font-weight: 600; color: #ef4444; margin-bottom: 8px; font-size: 14px;">📉 Top Loser</div>
                                        <div style="color: #ffffff; font-weight: 500; margin-bottom: 4px;">${data.topLoser.company}</div>
                                        <div style="color: #ef4444; font-weight: bold;">${data.topLoser.changeFormatted || '-0.00%'}</div>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                            ` : ''}

                            <!-- Watchlist Table -->
                            <div style="background-color: #1f2937; padding: 24px; border-radius: 8px;">
                                <h2 class="mobile-title dark-text" style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #ffffff;">Your Watchlist</h2>
                                <div style="overflow-x: auto;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <thead>
                                            <tr style="background-color: #374151;">
                                                <th style="padding: 12px; text-align: left; font-size: 12px; color: #9ca3af; font-weight: 600;">COMPANY</th>
                                                <th style="padding: 12px; text-align: left; font-size: 12px; color: #9ca3af; font-weight: 600;">SYMBOL</th>
                                                <th style="padding: 12px; text-align: right; font-size: 12px; color: #9ca3af; font-weight: 600;">PRICE</th>
                                                <th style="padding: 12px; text-align: right; font-size: 12px; color: #9ca3af; font-weight: 600;">CHANGE</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${data.watchlist.map(stock => `
                                            <tr style="border-bottom: 1px solid #374151;">
                                                <td style="padding: 16px; font-size: 14px; color: #ffffff;">${stock.company}</td>
                                                <td style="padding: 16px; font-size: 14px; color: #ffffff; font-family: monospace;">${stock.symbol}</td>
                                                <td style="padding: 16px; text-align: right; font-size: 14px; color: #ffffff; font-family: monospace;">${stock.priceFormatted || 'N/A'}</td>
                                                <td style="padding: 16px; text-align: right; font-size: 14px; font-family: monospace; color: ${stock.changePercent && stock.changePercent >= 0 ? '#10b981' : '#ef4444'};">
                                                    ${stock.changeFormatted || '0.00%'}
                                                </td>
                                            </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 40px 0 0 0; width: 100%;">
                                <tr>
                                    <td align="center">
                                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/watchlist" style="display: block; width: 100%; background: linear-gradient(135deg, #FDD458 0%, #E8BA40 100%); color: #000000; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; line-height: 1; text-align: center; box-sizing: border-box;">
                                            View Full Watchlist
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Footer -->
                            <div style="text-align: center; margin: 40px 0 0 0;">
                                <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #9ca3af !important;">
                                    This is your daily watchlist update. You can manage your email preferences in your account settings.
                                </p>
                                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #9ca3af !important;">
                                    © 2025 Signalist
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    </body>
    </html>
  `,
});

export const getWeeklyWatchlistSummaryTemplate = (data: {
  email: string;
  name: string;
  watchlist: any[];
  totalWeeklyChange: number;
  bestPerformer: any;
  worstPerformer: any;
  weekOf: string;
}) => ({
  to: data.email,
  subject: `📈 Weekly Portfolio Summary - Week of ${data.weekOf}`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weekly Portfolio Summary</title>
        <style type="text/css">
            @media (prefers-color-scheme: dark) {
                .email-container {
                    background-color: #141414 !important;
                    border: 1px solid #30333A !important;
                }
                .dark-bg {
                    background-color: #050505 !important;
                }
                .dark-text {
                    color: #ffffff !important;
                }
                .dark-text-secondary {
                    color: #9ca3af !important;
                }
                .dark-text-muted {
                    color: #6b7280 !important;
                }
                .dark-border {
                    border-color: #30333A !important;
                }
            }
            
            @media only screen and (max-width: 600px) {
                .email-container {
                    width: 100% !important;
                    margin: 0 !important;
                }
                .mobile-padding {
                    padding: 24px !important;
                }
                .mobile-title {
                    font-size: 20px !important;
                }
                .mobile-text {
                    font-size: 14px !important;
                }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #050505;">
            <tr>
                <td align="center" class="mobile-outer-padding" style="padding: 40px 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container" style="max-width: 600px; background-color: #141414; border-radius: 8px; border: 1px solid #30333A;">
                        
                        <!-- Header -->
                        <tr>
                            <td class="mobile-padding" style="padding: 40px 40px 40px 40px;">
                                <h1 class="mobile-title dark-text" style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: #FDD458; line-height: 1.2; text-align: center;">
                                    📈 Weekly Portfolio Summary
                                </h1>
                                <p class="mobile-text dark-text-muted" style="margin: 0 0 30px 0; font-size: 14px; line-height: 1.4; color: #6b7280; text-align: center;">
                                    Your performance for the week of ${data.weekOf}
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Weekly Performance -->
                        <tr>
                            <td class="mobile-padding" style="padding: 0 40px 40px 40px;">
                            <div style="background-color: #1f2937; padding: 32px; border-radius: 8px; margin-bottom: 20px;">
                                <h2 class="mobile-title dark-text" style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #ffffff;">Weekly Performance</h2>
                                <div style="text-align: center; padding: 20px;">
                                    <div style="font-size: 42px; font-weight: bold; color: ${data.totalWeeklyChange >= 0 ? '#10b981' : '#ef4444'};">
                                        ${data.totalWeeklyChange >= 0 ? '+' : ''}${data.totalWeeklyChange.toFixed(2)}%
                                    </div>
                                    <div style="font-size: 14px; color: #9ca3af; margin-top: 8px;">Average Portfolio Change</div>
                                </div>
                            </div>

                            <!-- Best & Worst Performers -->
                            <div style="background-color: #1f2937; padding: 24px; border-radius: 8px; margin-bottom: 20px;">
                                <h2 class="mobile-title dark-text" style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #ffffff;">Weekly Stars</h2>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                    <div style="background-color: #064e3b; border: 1px solid #10b981; padding: 20px; border-radius: 6px;">
                                        <div style="font-weight: 600; color: #10b981; margin-bottom: 12px; font-size: 14px;">🏆 Best Performer</div>
                                        <div style="color: #ffffff; font-weight: 500; margin-bottom: 8px;">${data.bestPerformer.company}</div>
                                        <div style="color: #10b981; font-weight: bold;">${data.bestPerformer.changeFormatted || '+0.00%'}</div>
                                        <div style="color: #9ca3af; font-size: 12px; margin-top: 8px;">${data.bestPerformer.symbol}</div>
                                    </div>
                                    <div style="background-color: #7f1d1d; border: 1px solid #ef4444; padding: 20px; border-radius: 6px;">
                                        <div style="font-weight: 600; color: #ef4444; margin-bottom: 12px; font-size: 14px;">📉 Worst Performer</div>
                                        <div style="color: #ffffff; font-weight: 500; margin-bottom: 8px;">${data.worstPerformer.company}</div>
                                        <div style="color: #ef4444; font-weight: bold;">${data.worstPerformer.changeFormatted || '-0.00%'}</div>
                                        <div style="color: #9ca3af; font-size: 12px; margin-top: 8px;">${data.worstPerformer.symbol}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Detailed Watchlist -->
                            <div style="background-color: #1f2937; padding: 24px; border-radius: 8px;">
                                <h2 class="mobile-title dark-text" style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #ffffff;">Complete Watchlist Performance</h2>
                                <div style="overflow-x: auto;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <thead>
                                            <tr style="background-color: #374151;">
                                                <th style="padding: 12px; text-align: left; font-size: 12px; color: #9ca3af; font-weight: 600;">COMPANY</th>
                                                <th style="padding: 12px; text-align: left; font-size: 12px; color: #9ca3af; font-weight: 600;">SYMBOL</th>
                                                <th style="padding: 12px; text-align: right; font-size: 12px; color: #9ca3af; font-weight: 600;">PRICE</th>
                                                <th style="padding: 12px; text-align: right; font-size: 12px; color: #9ca3af; font-weight: 600;">WEEKLY CHANGE</th>
                                                <th style="padding: 12px; text-align: right; font-size: 12px; color: #9ca3af; font-weight: 600;">VALUE (100 shares)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${data.watchlist.map(stock => `
                                            <tr style="border-bottom: 1px solid #374151;">
                                                <td style="padding: 16px; font-size: 14px; color: #ffffff;">${stock.company}</td>
                                                <td style="padding: 16px; font-size: 14px; color: #ffffff; font-family: monospace;">${stock.symbol}</td>
                                                <td style="padding: 16px; text-align: right; font-size: 14px; color: #ffffff; font-family: monospace;">${stock.priceFormatted || 'N/A'}</td>
                                                <td style="padding: 16px; text-align: right; font-size: 14px; font-family: monospace; color: ${stock.weeklyChange >= 0 ? '#10b981' : '#ef4444'};">
                                                    ${stock.weeklyChange >= 0 ? '+' : ''}${stock.weeklyChange.toFixed(2)}%
                                                </td>
                                                <td style="padding: 16px; text-align: right; font-size: 14px; color: #ffffff; font-family: monospace;">
                                                    $${stock.weeklyValue.toFixed(2)}
                                                </td>
                                            </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <!-- CTA Buttons -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 40px 0 0 0; width: 100%;">
                                <tr>
                                    <td align="center">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td align="center" style="padding: 0 10px 0 0;">
                                                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/watchlist" style="display: block; width: 100%; background: linear-gradient(135deg, #FDD458 0%, #E8BA40 100%); color: #000000; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; line-height: 1; text-align: center; box-sizing: border-box;">
                                                        Manage Watchlist
                                                    </a>
                                                </td>
                                                <td align="center" style="padding: 0 0 0 10px;">
                                                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/stocks/${data.bestPerformer?.symbol || 'AAPL'}" style="display: block; width: 100%; background-color: #374151; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; line-height: 1; text-align: center; box-sizing: border-box;">
                                                        View Best Performer
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Footer -->
                            <div style="text-align: center; margin: 40px 0 0 0;">
                                <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #9ca3af !important;">
                                    This is your weekly portfolio summary. Keep up the great work!
                                </p>
                                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #9ca3af !important;">
                                    © 2025 Signalist
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    </body>
    </html>
  `,
});
