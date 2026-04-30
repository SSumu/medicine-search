package com.medicalsystem.medicine_search.service;

import com.medicalsystem.medicine_search.dto.PaginatedResponseDTO;
import com.medicalsystem.medicine_search.dto.PharmacyRequestDTO;
import com.medicalsystem.medicine_search.dto.PharmacySearchResponseDTO;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PharmacyService {
    
    // ✅ GET ALL WITH PAGINATION
    PaginatedResponseDTO<PharmacySearchResponseDTO> getAllPharmacies(Pageable pageable);

    // ✅ GET PHARMACY BY ID
    PharmacySearchResponseDTO getPharmacyById(Long id);

    // ✅ PAGINATION USING PAGE & SIZE (INTERFACE METHOD)
    PaginatedResponseDTO<PharmacySearchResponseDTO> getPaginatedPharmacies(int page, int size);

    List<PharmacySearchResponseDTO> getAvailablePharmacies();

    // ✅ SEARCH WITH PAGINATION --> This is for the new way.
    PaginatedResponseDTO<PharmacySearchResponseDTO> searchPharmacies(
            String location,
            String city,
            String pharmacyName,
            Pageable pageable
    );

    // ✅ GET AVAILABLE PHARMACIES (WITH PAGINATION) --> This is for the new method.
    PaginatedResponseDTO<PharmacySearchResponseDTO> getAvailablePharmaciesPaginated(Pageable pageable);

    PharmacySearchResponseDTO createPharmacy(PharmacyRequestDTO pharmacyRequestDTO);

    PharmacySearchResponseDTO updatePharmacy(Long id, PharmacyRequestDTO pharmacyRequestDTO);

    void deletePharmacy(Long id);

}
