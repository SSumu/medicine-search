package com.medicalsystem.medicine_search.mapper;

import com.medicalsystem.medicine_search.dto.MedicineSearchResponseDTO;
import com.medicalsystem.medicine_search.entity.Inventory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MedicineMapper {

    public MedicineSearchResponseDTO toDto(Inventory inventory) {
        if (inventory == null || inventory.getMedicine() == null || inventory.getPharmacy() == null ) {
            return null;
        }

        return MedicineSearchResponseDTO.builder()
                .medicineName(inventory.getMedicine().getName())
                .price(inventory.getMedicine().getPrice())
                .pharmacyName(inventory.getPharmacy().getName())
                .latitude(inventory.getPharmacy().getLatitude())
                .longitude(inventory.getPharmacy().getLongitude())
                .build();
    }
}
