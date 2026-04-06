package com.medicalsystem.medicine_search.mapper;

import com.medicalsystem.medicine_search.dto.MedicineRequestDTO;
import com.medicalsystem.medicine_search.dto.MedicineSearchResponseDTO;
import com.medicalsystem.medicine_search.entity.Medicine;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MedicineMapper {

    // 🔁 From Medicine Entity → Response DTO
    public MedicineSearchResponseDTO toDto(Medicine medicine) {
        if (medicine == null) {
            return null;
        }

        return MedicineSearchResponseDTO.builder()
                .medicineId(medicine.getMedicineId())
                .medicineName(medicine.getMedicineName())
                .description(medicine.getDescription())
                .manufacturer(medicine.getManufacturer())
                .price(medicine.getPrice())

//                .quantityAvailable(0)
//                .pharmacyId(null)
//                .pharmacyName(null)
//                .pharmacyAddress(null)
//
//                .latitude(null)
//                .longitude(null)
//
//                .availableLocally(true)
//                .availableInternationally(false)
                .build();
    }

    // Request DTO -> Medicine Entity
    public static Medicine toEntity(MedicineRequestDTO dto) {
        return Medicine.builder()
                .medicineName(dto.getMedicineName())
                .description(dto.getDescription())
                .manufacturer(dto.getManufacturer())
                .price(dto.getPrice())
                .build();
    }

    // Update existing Entity
    public static void updateEntity(Medicine medicine, MedicineRequestDTO dto) {
        medicine.setMedicineName(dto.getMedicineName());
        medicine.setDescription(dto.getDescription());
        medicine.setManufacturer(dto.getManufacturer());
        medicine.setPrice(dto.getPrice());
    }
}