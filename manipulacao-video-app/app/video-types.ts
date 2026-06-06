export interface VideoData {
  id: number;
  name: string;
  url: string;
}

export type FilterType = 'none' | 'grayscale' | 'red' | 'green' | 'blue';