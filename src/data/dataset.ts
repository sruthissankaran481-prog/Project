/**
 * Synthetic Dataset Generator for Social Media Engagement Analysis
 * Generates ~300 rows of consistent social media post data using a seedable pseudo-random generator.
 */

export interface PostRecord {
  id: number;
  postDate: string;
  platform: 'Instagram' | 'Twitter' | 'LinkedIn';
  contentType: 'Image' | 'Video' | 'Text' | 'Carousel';
  postingTime: 'Morning' | 'Afternoon' | 'Evening';
  likes: number;
  comments: number;
  shares: number;
  followerCount: number;
  engagementRate: number; // ((likes + comments + shares) / followerCount) * 100
}

// Simple seedable Linear Congruential Generator (LCG)
export function createRandom(seed: number) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function generateDataset(): PostRecord[] {
  const random = createRandom(12345); // Fixed seed for reproducible data
  const data: PostRecord[] = [];
  
  // Dates spanning roughly Jan 1, 2026 to Jun 20, 2026
  const startDate = new Date('2026-01-01T12:00:00');
  const totalDays = 170;
  
  // Base follower count and growth parameters
  let currentFollowers = 12500;
  
  for (let i = 1; i <= 300; i++) {
    // Distribute posts across time
    const dayOffset = Math.floor((i / 300) * totalDays);
    const postDateObj = new Date(startDate);
    postDateObj.setDate(startDate.getDate() + dayOffset);
    
    // Add some random hour/minutes variation
    const hourOffset = Math.floor(random() * 24);
    postDateObj.setHours(hourOffset);
    const postDateStr = postDateObj.toISOString().split('T')[0];
    
    // 1. Choose platform with weighted probability
    const platformRand = random();
    let platform: 'Instagram' | 'Twitter' | 'LinkedIn' = 'Instagram';
    if (platformRand > 0.66) {
      platform = 'LinkedIn';
    } else if (platformRand > 0.33) {
      platform = 'Twitter';
    }
    
    // 2. Choose Content Type based on platform constraints
    let contentType: 'Image' | 'Video' | 'Text' | 'Carousel' = 'Image';
    const typeRand = random();
    
    if (platform === 'Instagram') {
      // Instagram: Video (45%), Carousel (35%), Image (20%)
      if (typeRand < 0.45) contentType = 'Video';
      else if (typeRand < 0.80) contentType = 'Carousel';
      else contentType = 'Image';
    } else if (platform === 'LinkedIn') {
      // LinkedIn: Text (35%), Image (25%), Video (20%), Carousel (20%)
      if (typeRand < 0.35) contentType = 'Text';
      else if (typeRand < 0.60) contentType = 'Image';
      else if (typeRand < 0.80) contentType = 'Video';
      else contentType = 'Carousel';
    } else {
      // Twitter: Text (50%), Image (35%), Video (15%)
      if (typeRand < 0.50) contentType = 'Text';
      else if (typeRand < 0.85) contentType = 'Image';
      else contentType = 'Video';
    }
    
    // 3. Choose Posting Time
    const timeRand = random();
    let postingTime: 'Morning' | 'Afternoon' | 'Evening' = 'Morning';
    if (timeRand < 0.35) postingTime = 'Morning';
    else if (timeRand < 0.70) postingTime = 'Afternoon';
    else postingTime = 'Evening';
    
    // Followers grow slowly over the 6 months from ~12k to ~16.5k
    currentFollowers = Math.round(12000 + (dayOffset / totalDays) * 4000 + (random() * 400 - 200));
    
    // Calculate expected engagement rate based on real correlations
    // Base Rates
    let baseRate = 2.0; // in percent
    if (platform === 'Instagram') baseRate = 3.2;
    else if (platform === 'LinkedIn') baseRate = 4.5;
    else if (platform === 'Twitter') baseRate = 1.4;
    
    // Content type modifiers
    let contentModifier = 0.0;
    if (contentType === 'Video') contentModifier = 1.8;
    else if (contentType === 'Carousel') contentModifier = 2.5;
    else if (contentType === 'Text' && platform === 'LinkedIn') contentModifier = 1.0;
    else if (contentType === 'Text' && platform === 'Twitter') contentModifier = 0.6;
    else if (contentType === 'Image') contentModifier = 0.2;
    
    // Posting time modifiers (varying by platform for interesting cross-analysis)
    let timeModifier = 0.0;
    if (platform === 'Instagram') {
      // Instagram works best in Evening
      if (postingTime === 'Evening') timeModifier = 1.5;
      else if (postingTime === 'Morning') timeModifier = 0.4;
      else timeModifier = -0.2;
    } else if (platform === 'LinkedIn') {
      // LinkedIn works best in Morning (business hours)
      if (postingTime === 'Morning') timeModifier = 1.8;
      else if (postingTime === 'Afternoon') timeModifier = 0.8;
      else timeModifier = -1.5;
    } else {
      // Twitter works best in Afternoon and Morning
      if (postingTime === 'Afternoon') timeModifier = 0.9;
      else if (postingTime === 'Morning') timeModifier = 0.5;
      else timeModifier = -0.3;
    }
    
    // Add random variance (-0.6% to +0.6%)
    const variance = (random() * 1.2) - 0.6;
    
    // Total targeted engagement rate
    let targetRate = baseRate + contentModifier + timeModifier + variance;
    if (targetRate < 0.2) targetRate = 0.2 + (random() * 0.1); // min engagement rate
    
    // Engagement total = Rate * Followers / 100
    const totalEngagement = Math.round((targetRate / 100) * currentFollowers);
    
    // Distribute total engagement into Likes, Comments, Shares
    let likes = 0;
    let comments = 0;
    let shares = 0;
    
    if (totalEngagement > 0) {
      if (platform === 'Instagram') {
        // High likes, high comments, lower shares
        likes = Math.round(totalEngagement * (0.80 + (random() * 0.06 - 0.03)));
        comments = Math.round(totalEngagement * (0.14 + (random() * 0.04 - 0.02)));
        shares = Math.max(0, totalEngagement - likes - comments);
      } else if (platform === 'LinkedIn') {
        // High shares (reposts), moderate comments, moderate likes
        likes = Math.round(totalEngagement * (0.65 + (random() * 0.06 - 0.03)));
        shares = Math.round(totalEngagement * (0.22 + (random() * 0.04 - 0.02)));
        comments = Math.max(0, totalEngagement - likes - shares);
      } else {
        // Twitter: very high shares (retweets), lower comments
        likes = Math.round(totalEngagement * (0.60 + (random() * 0.08 - 0.04)));
        shares = Math.round(totalEngagement * (0.30 + (random() * 0.06 - 0.03)));
        comments = Math.max(0, totalEngagement - likes - shares);
      }
      
      // Safety checks
      if (likes < 0) likes = 0;
      if (comments < 0) comments = 0;
      if (shares < 0) shares = 0;
      
      // Adjust to make sum perfect
      const currentSum = likes + comments + shares;
      const diff = totalEngagement - currentSum;
      likes += diff;
      if (likes < 0) likes = 0;
    }
    
    // Recalculate precise rate from final counts
    const finalRate = Number((((likes + comments + shares) / currentFollowers) * 100).toFixed(2));
    
    data.push({
      id: i,
      postDate: postDateStr,
      platform,
      contentType,
      postingTime,
      likes,
      comments,
      shares,
      followerCount: currentFollowers,
      engagementRate: finalRate
    });
  }
  
  return data;
}

export function convertToCSV(data: PostRecord[]): string {
  const headers = ['Post Date', 'Platform', 'Content Type', 'Posting Time', 'Likes', 'Comments', 'Shares', 'Follower Count', 'Engagement Rate (%)'];
  const rows = data.map(r => [
    r.postDate,
    r.platform,
    r.contentType,
    r.postingTime,
    r.likes,
    r.comments,
    r.shares,
    r.followerCount,
    r.engagementRate
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.map(val => typeof val === 'string' ? `"${val}"` : val).join(','))
  ].join('\n');
}
