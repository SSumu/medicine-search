export interface Medicine {
  id: number;
  name: string;
  manufacturer: string;
  quantity: number | null;
  price: number | null;
  description?: string;
}
