export const getAlertCreatedEmailTemplate = (data: {
  email: string;
  alertName: string;
  symbol: string;
  company: string;
  alertType: 'upper' | 'lower';
  threshold: number;
  frequency: 'once' | 'daily' | 'weekly';
}) => ({
  to: data.email,
  subject: `Alert Created: ${data.alertName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Stock Alert Created</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Your price alert has been set up successfully</p>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Alert Details</h2>
          
          <div style="display: grid; grid-template-columns: 120px 1fr; gap: 10px; margin-bottom: 15px;">
            <span style="color: #6b7280; font-weight: 500;">Alert Name:</span>
            <span style="color: #1f2937; font-weight: 600;">${data.alertName}</span>
          </div>
          
          <div style="display: grid; grid-template-columns: 120px 1fr; gap: 10px; margin-bottom: 15px;">
            <span style="color: #6b7280; font-weight: 500;">Stock:</span>
            <span style="color: #1f2937;">${data.company} (${data.symbol})</span>
          </div>
          
          <div style="display: grid; grid-template-columns: 120px 1fr; gap: 10px; margin-bottom: 15px;">
            <span style="color: #6b7280; font-weight: 500;">Condition:</span>
            <span style="color: #1f2937;">
              Price goes ${data.alertType === 'upper' ? 'ABOVE' : 'BELOW'} $${data.threshold}
            </span>
          </div>
          
          <div style="display: grid; grid-template-columns: 120px 1fr; gap: 10px; margin-bottom: 15px;">
            <span style="color: #6b7280; font-weight: 500;">Frequency:</span>
            <span style="color: #1f2937;">
              ${data.frequency === 'once' ? 'Once (will deactivate after triggering)' : 
                data.frequency === 'daily' ? 'Daily' : 'Weekly'}
            </span>
          </div>
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            <strong>Note:</strong> You will receive email notifications when this alert condition is met. 
            ${data.frequency === 'once' ? 'The alert will automatically deactivate after the first notification.' : 
              'You will receive notifications based on your selected frequency.'}
          </p>
        </div>
        
        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/watchlist" 
             style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
            View Your Watchlist
          </a>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>© 2024 Stockzmaniac. All rights reserved.</p>
      </div>
    </div>
  `,
});

export const getAlertTriggeredEmailTemplate = (data: {
  email: string;
  alertName: string;
  symbol: string;
  company: string;
  currentPrice: number;
  threshold: number;
  alertType: 'upper' | 'lower';
}) => ({
  to: data.email,
  subject: `🚨 Alert Triggered: ${data.alertName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">🚨</div>
        <h1 style="margin: 0; font-size: 24px;">Stock Alert Triggered</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Your price alert condition has been met</p>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Alert Triggered</h2>
          
          <div style="background: ${data.alertType === 'upper' ? '#dcfce7' : '#fee2e2'}; 
                      border: 1px solid ${data.alertType === 'upper' ? '#22c55e' : '#ef4444'}; 
                      padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <p style="margin: 0; color: ${data.alertType === 'upper' ? '#166534' : '#991b1b'}; font-weight: 500;">
              ${data.company} (${data.symbol}) price is now <strong>$${data.currentPrice.toFixed(2)}</strong>
            </p>
            <p style="margin: 5px 0 0 0; color: ${data.alertType === 'upper' ? '#166534' : '#991b1b'};">
              ${data.alertType === 'upper' ? 'ABOVE' : 'BELOW'} your threshold of $${data.threshold}
            </p>
          </div>
          
          <div style="display: grid; grid-template-columns: 120px 1fr; gap: 10px; margin-bottom: 15px;">
            <span style="color: #6b7280; font-weight: 500;">Alert Name:</span>
            <span style="color: #1f2937; font-weight: 600;">${data.alertName}</span>
          </div>
          
          <div style="display: grid; grid-template-columns: 120px 1fr; gap: 10px; margin-bottom: 15px;">
            <span style="color: #6b7280; font-weight: 500;">Current Price:</span>
            <span style="color: #1f2937; font-weight: 600;">$${data.currentPrice.toFixed(2)}</span>
          </div>
          
          <div style="display: grid; grid-template-columns: 120px 1fr; gap: 10px; margin-bottom: 15px;">
            <span style="color: #6b7280; font-weight: 500;">Threshold:</span>
            <span style="color: #1f2937;">$${data.threshold}</span>
          </div>
        </div>
        
        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/stocks/${data.symbol}" 
             style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-right: 10px;">
            View Stock Details
          </a>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/watchlist" 
             style="display: inline-block; background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
            Manage Alerts
          </a>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>© 2024 Stockzmaniac. All rights reserved.</p>
      </div>
    </div>
  `,
});
