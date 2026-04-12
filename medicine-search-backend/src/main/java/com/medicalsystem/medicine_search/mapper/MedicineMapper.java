package com.medicalsystem.medicine_search.mapper;

import com.medicalsystem.medicine_search.dto.MedicineRequestDTO;
import com.medicalsystem.medicine_search.dto.MedicineSearchResponseDTO;
import com.medicalsystem.medicine_search.entity.Medicine;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MedicineMapper {

    // =======================================
    // 🔁 From Medicine Entity → Response DTO
    // =======================================
    public MedicineSearchResponseDTO toDto(Medicine medicine) {
        if (medicine == null) {
            return null;
        }

        return MedicineSearchResponseDTO.builder()
                .medicineId(medicine.getMedicineId())
                .medicineName(medicine.getMedicineName())
                .description(medicine.getDescription())
                .manufacturer(medicine.getManufacturer())
                .quantity(medicine.getQuantity())
                .price(medicine.getPrice())
                .lastUpdated(medicine.getLastUpdated())
                .build();
    }

    // ===============================
    // Request DTO -> Medicine Entity
    // ===============================
    public static Medicine toEntity(MedicineRequestDTO dto) {
        if ( dto == null ) {
            return null;
        }

        return Medicine.builder()
                .medicineName(dto.getMedicineName())
                .description(dto.getDescription())
                .manufacturer(dto.getManufacturer())
                .quantity(dto.getQuantity())
                .price(dto.getPrice())
                .build();
    }

    // ============================
    // 🔁 Update Existing Entity
    // ============================
    public static void updateEntity(Medicine medicine, MedicineRequestDTO dto) {
        medicine.setMedicineName(dto.getMedicineName());
        medicine.setDescription(dto.getDescription());
        medicine.setManufacturer(dto.getManufacturer());
        medicine.setQuantity(dto.getQuantity());
        medicine.setPrice(dto.getPrice());
    }
}