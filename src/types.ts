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
  engagementRate: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SandboxState {
  likes: number;
  comments: number;
  shares: number;
  followers: number;
  calculatedRate: number;
}

export type ActiveTabType = 'dataset' | 'sandbox' | 'python' | 'recommendations' | 'chat';
