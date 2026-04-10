package com.medicalsystem.medicine_search.repository;

import com.medicalsystem.medicine_search.entity.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {

    // Find pharmacies by name (case-insensitive)
    List<Pharmacy> findByPharmacyNameContainingIgnoreCase(String pharmacyName);

    // Find pharmacies by city (case-insensitive)
    List<Pharmacy> findByCityContainingIgnoreCase(String city);

    // Find pharmacies by country (case-insensitive)
    List<Pharmacy> findByCountryContainingIgnoreCase(String country);

    // Find pharmacies by name AND city
    List<Pharmacy> findByPharmacyNameContainingIgnoreCaseAndCityContainingIgnoreCase(String pharmacyName, String city);
}
