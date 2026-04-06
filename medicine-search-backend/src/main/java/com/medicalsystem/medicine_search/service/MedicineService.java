package com.medicalsystem.medicine_search.service;

import com.medicalsystem.medicine_search.dto.MedicineRequestDTO;
import com.medicalsystem.medicine_search.dto.MedicineSearchResponseDTO;
import com.medicalsystem.medicine_search.entity.Medicine;

import java.util.List;
import java.util.Optional;

public interface MedicineService {

    Optional<MedicineSearchResponseDTO> getMedicineById(Long id);

    List<MedicineSearchResponseDTO> getAllMedicines();

    List<MedicineSearchResponseDTO> getMedicinesByPriceRange(double minPrice, double maxPrice);

    // ✅ Save new medicine
    MedicineSearchResponseDTO saveMedicine(MedicineRequestDTO medicineRequestDTO);

    Optional<MedicineSearchResponseDTO> updateMedicine(Long id, MedicineRequestDTO medicineRequestDTO);

    void deleteMedicine(Long id);

    List<MedicineSearchResponseDTO> searchMedicinesByName(String name);

    List<MedicineSearchResponseDTO> searchMedicines(String name, double minPrice, double maxPrice);
}
