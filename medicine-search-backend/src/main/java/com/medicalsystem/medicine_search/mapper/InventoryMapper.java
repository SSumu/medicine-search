package com.medicalsystem.medicine_search.mapper;

import com.medicalsystem.medicine_search.dto.InventoryResponseDTO;
import com.medicalsystem.medicine_search.dto.MedicineDTO;
import com.medicalsystem.medicine_search.dto.PharmacyDTO;
import com.medicalsystem.medicine_search.entity.Inventory;
import com.medicalsystem.medicine_search.entity.Medicine;
import com.medicalsystem.medicine_search.entity.Pharmacy;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public InventoryResponseDTO toDto(Inventory inventory) {

        if (inventory == null) {
            return null;
        }

        Pharmacy pharmacy = inventory.getPharmacy();
        Medicine medicine = inventory.getMedicine();

        // Build PharmacyDTO
        PharmacyDTO pharmacyDTO = null;
        if (pharmacy != null) {
            pharmacyDTO = PharmacyDTO.builder()
                    .pharmacyId(pharmacy.getPharmacyId())
                    .pharmacyName(pharmacy.getPharmacyName())
                    .pharmacyLocation(pharmacy.getPharmacyLocation())
                    .build();
        }

        // Build MedicineDTO
        MedicineDTO medicineDTO = null;
        if (medicine != null) {
            medicineDTO = MedicineDTO.builder()
                    .medicineId(medicine.getMedicineId())
                    .medicineName(medicine.getMedicineName())
                    .build();
        }

        // Build InventoryResponseDTO
        return InventoryResponseDTO.builder()
                .id(inventory.getId())
                .pharmacy(pharmacyDTO)
                .medicine(medicineDTO)
                .quantity(inventory.getQuantity())
                .price(inventory.getPrice())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }
}