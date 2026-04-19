package com.medicalsystem.medicine_search.service;

import com.medicalsystem.medicine_search.dto.PaginatedResponse;
import com.medicalsystem.medicine_search.dto.PharmacyRequestDTO;
import com.medicalsystem.medicine_search.dto.PharmacySearchResponseDTO;
//import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PharmacyService {

//    This is for the previous method.
//    List<PharmacySearchResponseDTO> getAllPharmacies();

    //    This is the new method.
    // ✅ GET ALL WITH PAGINATION
    PaginatedResponse<PharmacySearchResponseDTO> getAllPharmacies(Pageable pageable);

    // ✅ GET PHARMACY BY ID
    PharmacySearchResponseDTO getPharmacyById(Long id);

    // ✅ PAGINATION USING PAGE & SIZE (INTERFACE METHOD)
//    Previous type of this method is Page.
    PaginatedResponse<PharmacySearchResponseDTO> getPaginatedPharmacies(int page, int size);

//    This is for the old method and its type is List.
//    List<PharmacySearchResponseDTO> searchPharmacies(String location, String city, String pharmacyName);

    List<PharmacySearchResponseDTO> getAvailablePharmacies();

    // ✅ SEARCH (DYNAMIC) --> This is for the previous way. In that way, the type is List.
    // ✅ SEARCH WITH PAGINATION --> This is for the new way.
    PaginatedResponse<PharmacySearchResponseDTO> searchPharmacies(
            String location,
            String city,
            String pharmacyName,
            Pageable pageable
    );

    // ✅ GET AVAILABLE PHARMACIES (WITH PAGINATION) --> This is for the new method.
    PaginatedResponse<PharmacySearchResponseDTO> getAvailablePharmaciesPaginated(Pageable pageable);

    PharmacySearchResponseDTO createPharmacy(PharmacyRequestDTO pharmacyRequestDTO);

    PharmacySearchResponseDTO updatePharmacy(Long id, PharmacyRequestDTO pharmacyRequestDTO);

    void deletePharmacy(Long id);

//    PaginatedResponse<PharmacySearchResponseDTO> getAvailablePharmaciesPaginated(Pageable pageable);

//    List<PharmacySearchResponseDTO> searchPharmaciesByName(String name);
//
//    List<PharmacySearchResponseDTO> searchPharmaciesByCity(String city);
//
//    List<PharmacySearchResponseDTO> searchPharmaciesByCountry(String country);
//
//    List<PharmacySearchResponseDTO> searchPharmaciesByNameAndCity(String name, String city);
}
