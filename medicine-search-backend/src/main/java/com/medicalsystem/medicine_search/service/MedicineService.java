package com.medicalsystem.medicine_search.service;

import com.medicalsystem.medicine_search.dto.MedicineSearchResponseDTO;
import com.medicalsystem.medicine_search.entity.Medicine;

import java.util.List;
import java.util.Optional;

public interface MedicineService {

    Optional<Medicine> getMedicineById(Long id);
    List<Medicine> getAllMedicines();
    

    List<Medicine> getMedicinesByPriceRange(double minPrice, double maxPrice);

    // Add this method:
    Medicine saveMedicine(Medicine medicine);

    Medicine updateMedicine(Long id, Medicine medicine);

    void deleteMedicine(Long id);

    List<MedicineSearchResponseDTO> searchMedicinesByName(String name);
}
