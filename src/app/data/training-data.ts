// Training data for phishing detection models
import { TrainingData } from '../utils/ml-models';
import { processBERTBatch, bertFeaturesToVector } from '../utils/bert-processor';

// Sample phishing emails
const phishingEmails = [
  'URGENT: Your account has been suspended. Click here immediately to verify your identity or lose access forever.',
  'Congratulations! You have won $1,000,000 in the lottery. Send your bank details to claim your prize now.',
  'Your PayPal account requires immediate verification. Failure to confirm within 24 hours will result in permanent closure.',
  'Security Alert: Suspicious activity detected on your account. Update your password now using this link.',
  'Dear Customer, Your credit card has been charged $599.99. If you did not authorize this transaction, click here immediately.',
  'Final Notice: Your account will be deleted in 2 hours unless you verify your information right now.',
  'You must update your billing information today or your service will be terminated. Act fast!',
  'IMPORTANT: IRS Tax Refund of $2,847 is pending. Click here to claim your refund before it expires.',
  'Your package delivery failed. Pay $3.99 shipping fee to reschedule delivery: http://suspicious-link.com',
  'Account Locked! Too many failed login attempts. Reset your password immediately to regain access.',
  'Dear valued customer, We have detected unauthorized access to your account. Verify identity now.',
  'Your Netflix subscription has expired. Update payment method within 24 hours or lose your account.',
  'WINNER NOTIFICATION: You have been selected for a $5000 gift card. Claim now before offer expires!',
  'Your Amazon order #12345 has been cancelled. Contact us immediately with your account details to resolve.',
  'URGENT ACTION REQUIRED: Your email account will be closed due to inactivity. Click here to keep it active.',
  'Security breach detected. Change your password now using this secure link or risk account compromise.',
  'Your Microsoft account has been compromised. Verify your identity immediately to prevent data loss.',
  'Final warning: Your Apple ID will be suspended in 24 hours. Update security information now.',
  'Dear user, suspicious login attempt from unknown location. Confirm your identity to secure account.',
  'Your bank account has been frozen due to suspicious activity. Call this number immediately: 555-0123.',
  'IMMEDIATE RESPONSE REQUIRED: Your Social Security number has been suspended. Call 555-9876 to reactivate.',
  'You have inherited $8.5 million from a distant relative. Send $500 processing fee to claim your inheritance.',
  'Your Google account will expire today! Click this link to renew your account immediately or lose all data.',
  'WARNING: Virus detected on your computer! Download our antivirus software now to protect your files.',
  'Dear Sir/Madam, I am a prince from Nigeria. I need your help to transfer $25 million. You will get 30% commission.',
  'Your credit score has dropped significantly! Click here to see why and fix it before its too late.',
  'ALERT: Someone is using your identity! Verify your personal information immediately to prevent fraud.',
  'Your Tax Return is ready! Click here to download your refund of $3,499.00 before deadline expires.',
  'Urgent Security Update: Your Facebook account has been hacked. Reset password now or lose access forever.',
  'You have won a free iPhone 15 Pro Max! Claim your prize by entering your shipping address and credit card.',
  'Your cryptocurrency wallet has been compromised. Transfer your funds to this secure address immediately.',
  'FINAL NOTICE: Legal action will be taken against you. Pay outstanding debt of $1,200 within 48 hours.',
  'Your Instagram account will be deleted due to copyright violation. Click here to appeal within 6 hours.',
  'Congratulations! You qualify for $50,000 personal loan with 0% APR. Apply now before spots fill up!',
  'Your Zoom account has been suspended for policy violation. Reactivate now by verifying your payment.',
  'CRITICAL: Your computer license has expired. Renew immediately or your system will shut down.',
  'You have unclaimed money from class action lawsuit. Enter SSN and bank info to receive $847.23.',
  'Your LinkedIn Premium will be charged $299.99 tomorrow. Cancel now if you did not subscribe.',
  'URGENT TAX NOTICE: You owe $4,850 in back taxes. Pay immediately to avoid criminal prosecution.',
  'Your WhatsApp will stop working in 2 hours. Upgrade to WhatsApp Gold by clicking this link.',
  'Dear customer, your Chase account has been limited. Restore access by confirming your ATM PIN.',
  'You are eligible for $8,500 stimulus check. Click here and enter your bank routing number to claim.',
  'Your eBay listing has been removed for violating terms. Pay $49 reinstatement fee to restore.',
  'SECURITY ALERT: Your Coinbase account accessed from Russia. Freeze account by clicking here now.',
  'Your Wells Fargo debit card has been blocked. Unblock it by verifying your card number and CVV code.',
  'Exclusive offer! Work from home and earn $5,000 per week. No experience needed. Click to start today!',
  'Your shipment from DHL is pending. Pay customs fee of $15.99 now or package will be returned.',
  'ACTION REQUIRED: Your Dropbox is full. Upgrade to premium within 12 hours or lose all your files.',
  'Your student loan can be forgiven! Enter your loan details now to see if you qualify for $0 payment.',
  'IMMEDIATE: Your Venmo account has suspicious activity. Secure it by providing your login credentials.',
];

// Sample legitimate emails
const legitimateEmails = [
  'Hello, Thank you for your recent purchase. Your order #12345 has been shipped and will arrive in 3-5 business days.',
  'Hi there, Just a friendly reminder about our weekly team meeting tomorrow at 2 PM. See you then!',
  'Welcome to our newsletter! We share monthly updates about our products and services. Unsubscribe anytime.',
  'Your subscription renewal is coming up next month. No action needed - we will automatically charge your card on file.',
  'Thank you for attending our webinar. Here is the recording and presentation slides as promised.',
  'Hi, I wanted to follow up on our conversation yesterday. Let me know if you have any questions.',
  'Your monthly statement is now available. You can view it anytime in your account dashboard.',
  'We have updated our privacy policy. You can review the changes on our website at your convenience.',
  'Hello, Your flight booking is confirmed. Your confirmation number is ABC123. Have a great trip!',
  'Reminder: Your dental appointment is scheduled for next Tuesday at 10 AM. Reply to confirm or reschedule.',
  'Thank you for your feedback. We appreciate your input and will use it to improve our services.',
  'Your support ticket has been resolved. Please let us know if you need any further assistance.',
  'New blog post: 5 Tips for Better Productivity. Check it out on our website when you have time.',
  'Happy birthday! Enjoy 20% off your next purchase with code BIRTHDAY20. Valid for 30 days.',
  'Your order has been delivered. We hope you enjoy your purchase. Feel free to leave a review.',
  'Weekly digest: Here are the top stories from our community this week. Enjoy your reading!',
  'Invitation: You are invited to our annual conference next month. Register on our website.',
  'Your application has been received. We will review it and get back to you within two weeks.',
  'Thank you for your donation. Your contribution makes a difference in our community.',
  'Course reminder: Your online course starts next Monday. All materials are available in the learning portal.',
  'Hi Team, Please review the attached document before our meeting on Friday. Let me know your thoughts.',
  'Your prescription is ready for pickup at your local pharmacy. Thank you for choosing our services.',
  'Welcome aboard! We are excited to have you on our team. Your orientation is scheduled for next Monday.',
  'Good morning, The maintenance work scheduled for this weekend has been completed successfully.',
  'Your return has been processed. The refund will appear in your account within 5-7 business days.',
  'Thank you for contacting customer support. Your inquiry reference number is CS-7890. We will respond soon.',
  'Reminder: Your library books are due next week. You can renew them online or at any branch location.',
  'Hi Sarah, Great meeting you at the conference last week. Looking forward to our collaboration.',
  'Your insurance policy renewal documents are attached. Please review and contact us with any questions.',
  'Event Update: Our community meetup has been moved to next Saturday at the same location. Hope to see you there!',
  'Your recipe of the week: Easy 30-minute pasta dish. Ingredients and instructions are included below.',
  'Project status: Phase 1 is complete. We are on track to begin Phase 2 next month as scheduled.',
  'Good afternoon, This is a reminder that your gym membership will renew automatically next month.',
  'Your tax documents for 2025 are now available. You can download them from your account portal.',
  'Thank you for registering for our workshop. You will receive the Zoom link one day before the event.',
  'Weather alert: Light rain expected tomorrow morning. Plan your commute accordingly.',
  'Your job application for Marketing Manager position has moved to the next round. Interview details to follow.',
  'Newsletter: This month we are featuring sustainable living tips and eco-friendly product recommendations.',
  'Hi everyone, Lunch will be provided at tomorrow meeting. Please let me know about any dietary restrictions.',
  'Your concert tickets have been emailed to you. Show your mobile ticket at the entrance. Enjoy the show!',
  'Grade notification: Your assignment has been graded. Log in to the student portal to view your results.',
  'Community notice: Street cleaning scheduled for your area on Thursday morning. Please move your vehicle.',
  'Thank you for your patience during our website upgrade. Everything is now back to normal operation.',
  'Your annual performance review is scheduled for next week. Please complete the self-assessment form.',
  'Hi neighbor, Our homeowners association meeting is this Thursday at 7 PM in the community center.',
  'Your pet grooming appointment is confirmed for next Tuesday at 3 PM. See you and your furry friend soon!',
  'Book club reminder: We are reading The Great Gatsby this month. Discussion meeting is on the 25th.',
  'Your warranty registration has been received. Keep this email for your records. Product ID: PD-9087.',
  'Season greetings from our family to yours. Wishing you a wonderful holiday season.',
  'Your subscription box will ship next week. Track your package using the tracking number we will send.',
];

let cachedTrainingData: TrainingData | null = null;
let trainingDataPromise: Promise<TrainingData> | null = null;

/**
 * Generate training data from email samples using BERT
 */
export async function getTrainingData(): Promise<TrainingData> {
  if (cachedTrainingData) {
    return cachedTrainingData;
  }

  if (trainingDataPromise) {
    return trainingDataPromise;
  }

  trainingDataPromise = (async () => {
    const features: number[][] = [];
    const labels: number[] = [];

    // Combine all emails for batch processing (more efficient)
    const allEmails = [...phishingEmails, ...legitimateEmails];
    
    // Process all emails with BERT in batches
    const batchSize = 10;
    for (let i = 0; i < allEmails.length; i += batchSize) {
      const batch = allEmails.slice(i, i + batchSize);
      const processed = await processBERTBatch(batch);
      
      for (let j = 0; j < processed.length; j++) {
        const item = processed[j];
        const featureVector = bertFeaturesToVector(
          item.embeddings,
          item.features,
          item.contextualFeatures
        );
        features.push(featureVector);
        
        // Determine label (phishing = 1, legitimate = 0)
        const globalIndex = i + j;
        const label = globalIndex < phishingEmails.length ? 1 : 0;
        labels.push(label);
      }
    }

    cachedTrainingData = { features, labels };
    return cachedTrainingData;
  })();

  return trainingDataPromise;
}

/**
 * Get test data (subset of training data for demonstration)
 */
export async function getTestData(): Promise<TrainingData> {
  const data = await getTrainingData();
  
  // Use last 20% as test data
  const testSize = Math.floor(data.features.length * 0.2);
  const startIdx = data.features.length - testSize;
  
  return {
    features: data.features.slice(startIdx),
    labels: data.labels.slice(startIdx),
  };
}