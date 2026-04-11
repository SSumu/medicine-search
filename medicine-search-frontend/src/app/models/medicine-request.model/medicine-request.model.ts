export interface MedicineRequestModel {
  medicineName: string;
  manufacturer: string;
  quantity: number | null;
  price: number | null;
  description?: string;
}
