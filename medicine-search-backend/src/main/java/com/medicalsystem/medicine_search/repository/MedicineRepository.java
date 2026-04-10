package com.medicalsystem.medicine_search.repository;

import com.medicalsystem.medicine_search.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    // ====================================
    // FIND MEDICINES WITHIN A PRICE RANGE
    // ====================================
    List<Medicine> findByPriceBetween (
            double minPrice,
            double maxPrice
    );

    // =====================================================
    // FIND MEDICINES BY NAME, PRICE RANGE AND PRICE FILTER
    // =====================================================
    List<Medicine> findByMedicineNameContainingIgnoreCaseAndPriceBetween (
            String medicineName,
            double minPrice,
            double maxPrice
    );

    // ========================
    // SEARCH BY MEDICINE NAME
    // ========================
    List<Medicine> findByMedicineNameContainingIgnoreCase( String medicineName );
}
