package com.medicalsystem.medicine_search.service;

import com.medicalsystem.medicine_search.dto.MedicineSearchResponseDTO;
import com.medicalsystem.medicine_search.entity.Medicine;

import java.util.List;
import java.util.Optional;

public interface MedicineService {

    Optional<MedicineSearchResponseDTO> getMedicineById(Long id);

    List<MedicineSearchResponseDTO> getAllMedicines();

    List<MedicineSearchResponseDTO> getMedicinesByPriceRange(double minPrice, double maxPrice);

    // Add this method:
    MedicineSearchResponseDTO saveMedicine(Medicine medicine);

    Optional<MedicineSearchResponseDTO> updateMedicine(Long id, Medicine medicine);

    void deleteMedicine(Long id);

    List<MedicineSearchResponseDTO> searchMedicinesByName(String name);

    List<MedicineSearchResponseDTO> searchMedicines(String name, double minPrice, double maxPrice);
}
