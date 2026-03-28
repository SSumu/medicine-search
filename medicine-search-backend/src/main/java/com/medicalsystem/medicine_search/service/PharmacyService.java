package com.medicalsystem.medicine_search.service;

import com.medicalsystem.medicine_search.dto.PharmacySearchResponseDTO;

import java.util.List;

public interface PharmacyService {

    List<PharmacySearchResponseDTO> getAllPharmacies();

    PharmacySearchResponseDTO getPharmacyById(Long id);

    List<PharmacySearchResponseDTO> searchPharmaciesByName(String name);

    List<PharmacySearchResponseDTO> searchPharmaciesByCity(String city);

    List<PharmacySearchResponseDTO> searchPharmaciesByCountry(String country);

    List<PharmacySearchResponseDTO> searchPharmaciesByNameAndCity(String name, String city);
}
