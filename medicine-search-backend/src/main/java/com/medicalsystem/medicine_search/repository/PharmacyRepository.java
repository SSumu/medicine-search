package com.medicalsystem.medicine_search.repository;

import com.medicalsystem.medicine_search.entity.Pharmacy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

//import java.util.List;

@Repository
public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {

//    These methods are for the old frontend.
    // Find pharmacies by name (case-insensitive)
//    List<Pharmacy> findByPharmacyNameContainingIgnoreCase(String pharmacyName);
//
//    // Find pharmacies by city (case-insensitive)
//    List<Pharmacy> findByCityContainingIgnoreCase(String city);
//
//    // Find pharmacies by country (case-insensitive)
//    List<Pharmacy> findByCountryContainingIgnoreCase(String country);
//
//    // Find pharmacies by name AND city
//    List<Pharmacy> findByPharmacyNameContainingIgnoreCaseAndCityContainingIgnoreCase(String pharmacyName, String city);

    // ✅ Dynamic Search Query --> This is for the old method.

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
//    For the old method the type is List.
//    for the new method the type is Page.
    Page<Pharmacy> searchDynamic(
            @Param("location") String location,
            @Param("city") String city,
            @Param("pharmacyName") String pharmacyName,
            Pageable pageable
    );

    // ✅ GET ONLY AVAILABLE PHARMACIES (PAGINATION SAFE)
    Page<Pharmacy> findByAvailableTrue(Pageable pageable);
//
//    // ✅ GET ONLY AVAILABLE PHARMACIES (LIST VERSION)
//    // (Optional but useful if you want direct DB filtering instead of stream)
}
