package com.medicalsystem.medicine_search.service;

import com.medicalsystem.medicine_search.dto.MedicineRequestDTO;
import com.medicalsystem.medicine_search.dto.MedicineSearchResponseDTO;

import java.util.List;
import java.util.Optional;

public interface MedicineService {

    // =====================
    // GET ALL MEDICINES
    // =====================
    List<MedicineSearchResponseDTO> getAllMedicines();

    // =====================
    // GET MEDICINE BY ID
    // =====================
    Optional<MedicineSearchResponseDTO> getMedicineByMedicineId (Long medicineId );

    // =============================
    // GET MEDICINES BY PRICE RANGE
    // =============================
    List<MedicineSearchResponseDTO> getMedicinesByPriceRange ( double minPrice, double maxPrice );

    // ======================
    // ✅ Save new medicine
    // ======================
    MedicineSearchResponseDTO saveMedicine ( MedicineRequestDTO medicineRequestDTO );

    // =====================
    // UPDATE MEDICINE
    // =====================
    Optional<MedicineSearchResponseDTO> updateMedicine( Long medicineId, MedicineRequestDTO medicineRequestDTO );

    // =====================
    // DELETE MEDICINE
    // =====================
    void deleteMedicine( Long medicineId );

    // ========================
    // SEARCH BY MEDICINE NAME
    // ========================
    List<MedicineSearchResponseDTO> searchMedicinesByMedicineName( String medicineName );

    // ========================================================
    // SEARCH BY NAME + PRICE RANGE (OPTIONAL - EXTRA FEATURE)
    // ========================================================
    List<MedicineSearchResponseDTO> searchMedicines( String medicineName, double minPrice, double maxPrice );
}
