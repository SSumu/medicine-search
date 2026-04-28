package com.medicalsystem.medicine_search.service;

import com.medicalsystem.medicine_search.dto.PaginatedResponse;
import com.medicalsystem.medicine_search.dto.PharmacyRequestDTO;
import com.medicalsystem.medicine_search.dto.PharmacySearchResponseDTO;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PharmacyService {
    
    // ✅ GET ALL WITH PAGINATION
    PaginatedResponse<PharmacySearchResponseDTO> getAllPharmacies(Pageable pageable);

    // ✅ GET PHARMACY BY ID
    PharmacySearchResponseDTO getPharmacyById(Long id);

    // ✅ PAGINATION USING PAGE & SIZE (INTERFACE METHOD)
    PaginatedResponse<PharmacySearchResponseDTO> getPaginatedPharmacies(int page, int size);

    List<PharmacySearchResponseDTO> getAvailablePharmacies();

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

}
