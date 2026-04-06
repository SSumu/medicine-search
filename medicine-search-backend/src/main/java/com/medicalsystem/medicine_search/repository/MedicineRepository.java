package com.medicalsystem.medicine_search.repository;

import com.medicalsystem.medicine_search.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    // Find medicines within a price range
    List<Medicine> findByPriceBetween(double minPrice, double maxPrice);

    // Find medicines by name and price range
    List<Medicine> findByMedicineNameContainingIgnoreCaseAndPriceBetween(
            String name, double minPrice, double maxPrice
    );

    List<Medicine> findByMedicineNameContainingIgnoreCase(String name);
}
