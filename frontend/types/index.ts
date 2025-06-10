export interface Quiz {
  id: number;
  title: string;
  description: string;
  image_url: string;
  is_popular: boolean;
  is_new: boolean;
  max_score: number;
  collaborator_name: string;
  collaborator_logo: string;
  collaborator_link: string;
  categories: { name: string; id: number; quiz_id: number }[];
  questions: any[];
  score_ratings: any[];
}