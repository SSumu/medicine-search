export interface Medicine {
  id: number;
  name: string;
  manufacturer: string;
  price: number | null;
  description?: string;
}
