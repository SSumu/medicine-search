package com.medicalsystem.medicine_search.mapper;

import com.medicalsystem.medicine_search.dto.MedicineSearchResponseDTO;
import com.medicalsystem.medicine_search.entity.Medicine;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MedicineMapper {

    // 🔁 From Medicine → DTO
    public MedicineSearchResponseDTO toDto(Medicine medicine) {
        if (medicine == null) {
            return null;
        }

        return MedicineSearchResponseDTO.builder()
                .medicineId(medicine.getId())
                .medicineName(medicine.getName())
                .description(medicine.getDescription())
                .manufacturer(medicine.getManufacturer())
                .price(medicine.getPrice())

                .quantityAvailable(0)
                .pharmacyId(null)
                .pharmacyName(null)
                .pharmacyAddress(null)

                .latitude(null)
                .longitude(null)

                .availableLocally(true)
                .availableInternationally(false)
                .build();
    }

}