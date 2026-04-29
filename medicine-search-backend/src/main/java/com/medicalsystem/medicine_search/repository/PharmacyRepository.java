package com.medicalsystem.medicine_search.repository;

import com.medicalsystem.medicine_search.entity.Pharmacy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {

    // ✅ Dynamic Search WITH Pagination --> This is for the new method.
    @Query("""
SELECT p FROM Pharmacy p
WHERE (:location IS NULL OR :location = ''
 OR LOWER(p.pharmacyLocation) LIKE LOWER(CONCAT('%', :location, '%')))
AND (:city IS NULL OR :city = ''
 OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')))
AND (:pharmacyName IS NULL OR :pharmacyName = ''
 OR LOWER(p.pharmacyName) LIKE LOWER(CONCAT('%', :pharmacyName, '%')))
""")

//    for the new method the type is Page.
    Page<Pharmacy> searchDynamic(
            @Param("location") String location,
            @Param("city") String city,
            @Param("pharmacyName") String pharmacyName,
            Pageable pageable
    );

    // ✅ GET ONLY AVAILABLE PHARMACIES (PAGINATION SAFE)
    Page<Pharmacy> findByAvailableTrue(Pageable pageable);

//    // ✅ GET ONLY AVAILABLE PHARMACIES (LIST VERSION)
//    // (Optional but useful if you want direct DB filtering instead of stream)

    @Query(value = "SELECT DISTINCT p FROM Pharmacy p LEFT JOIN FETCH p.schedule", countQuery = "SELECT COUNT(p) FROM Pharmacy p")
    Page<Pharmacy> findAllWithSchedule(Pageable pageable);
}
