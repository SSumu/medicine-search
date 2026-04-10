export interface Medicine {
  medicineId: number;
  medicineName: string;
  manufacturer: string;
  quantity: number | null;
  price: number | null;
  description?: string;
}
