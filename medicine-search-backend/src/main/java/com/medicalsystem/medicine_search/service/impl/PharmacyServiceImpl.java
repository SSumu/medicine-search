package com.medicalsystem.medicine_search.service.impl;

import com.medicalsystem.medicine_search.dto.PaginatedResponse;
import com.medicalsystem.medicine_search.dto.PharmacyRequestDTO;
import com.medicalsystem.medicine_search.dto.PharmacySearchResponseDTO;
import com.medicalsystem.medicine_search.entity.Pharmacy;
import com.medicalsystem.medicine_search.mapper.PharmacyMapper;
import com.medicalsystem.medicine_search.repository.PharmacyRepository;
import com.medicalsystem.medicine_search.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PharmacyServiceImpl implements PharmacyService {

    private final PharmacyRepository pharmacyRepository;
    private final PharmacyMapper pharmacyMapper;

//    This is the old method
    // ✅ GET ALL
//    @Override
//    public List<PharmacySearchResponseDTO> getAllPharmacies() {
//        return pharmacyRepository.findAll()
//                .stream()
//                .map(pharmacyMapper::toDto)
//                .collect(Collectors.toList());
//    }

//    This is the new method.
    // ✅ GET ALL WITH PAGINATION
    @Override
    public PaginatedResponse<PharmacySearchResponseDTO> getAllPharmacies(Pageable pageable) {

        Page<Pharmacy> pharmacyPage = pharmacyRepository.findAllWithSchedule(pageable);

        List<PharmacySearchResponseDTO> dtoList = pharmacyPage
                .getContent()
                .stream()
                .map(pharmacyMapper::toDto)
                .toList();

//        This is the old method for the previous condition.
//        Page<PharmacySearchResponseDTO> dtoPage = pageResult.map(pharmacyMapper::toDto);
//        return PaginatedResponse.from(dtoPage);

//        This is the new method for the new conditions.
        return new PaginatedResponse<>(
                dtoList,
                pharmacyPage.getNumber(),
                pharmacyPage.getSize(),
                pharmacyPage.getTotalElements(),
                pharmacyPage.getTotalPages()
        );
    }

    // ✅ GET PHARMACY BY ID
    @Override
    public PharmacySearchResponseDTO getPharmacyById(Long id) {
        return pharmacyRepository.findById(id)
                .map(pharmacyMapper::toDto)
//                .orElse(null) // This is for the previous method.
                .orElseThrow(() -> new RuntimeException("Pharmacy not found with id: " + id));
    }

    // ✅ PAGINATION USING PAGE & SIZE (INTERFACE METHOD)
//    Previous type of this method is Page.
    @Override
    public PaginatedResponse<PharmacySearchResponseDTO> getPaginatedPharmacies(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Pharmacy> pageResult = pharmacyRepository.findAll(pageable);

        Page<PharmacySearchResponseDTO> dtoPage = pageResult.map(pharmacyMapper::toDto);

//        This is for the previous method.
//        return pharmacyRepository.findAll(pageable).map(pharmacyMapper::toDto);

        return PaginatedResponse.from(dtoPage);
    }

//    @Override
//    public List<PharmacySearchResponseDTO> searchPharmaciesByName(String pharmacyName) {
//        return pharmacyRepository.findByPharmacyNameContainingIgnoreCase(pharmacyName)
//                .stream()
//                .map(pharmacyMapper::toDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<PharmacySearchResponseDTO> searchPharmaciesByCity(String city) {
//        return pharmacyRepository.findByCityContainingIgnoreCase(city)
//                .stream()
//                .map(pharmacyMapper::toDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<PharmacySearchResponseDTO> searchPharmaciesByCountry(String country) {
//        return pharmacyRepository.findByCountryContainingIgnoreCase(country)
//                .stream()
//                .map(pharmacyMapper::toDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<PharmacySearchResponseDTO> searchPharmaciesByNameAndCity(String pharmacyName, String city) {
//        return pharmacyRepository.findByPharmacyNameContainingIgnoreCaseAndCityContainingIgnoreCase(pharmacyName, city)
//                .stream()
//                .map(pharmacyMapper::toDto)
//                .collect(Collectors.toList());
//    }

//    This is for the previous way.
    // ✅ PAGINATION
//    @Override
//    public Page<PharmacySearchResponseDTO> getPaginatedPharmacies(int page, int size) {
//
//        Pageable pageable = PageRequest.of(page, size, Sort.by("pharmacyName").ascending());
//
//        Page<Pharmacy> pharmacyPage = pharmacyRepository.findAll(pageable);
//
//        return pharmacyPage.map(pharmacyMapper::toDto);
//    }

    // ✅ GET AVAILABLE PHARMACIES (LIST VERSION)
    @Override
    public List<PharmacySearchResponseDTO> getAvailablePharmacies() {
    return pharmacyRepository.findAll()
            .stream()
            .filter(pharmacy -> Boolean.TRUE.equals(pharmacy.getAvailable()))
            .map(pharmacyMapper::toDto)
            .collect(Collectors.toList());
    }

    // ✅ GET AVAILABLE PHARMACIES (PAGINATED VERSION)
    @Override
    public PaginatedResponse<PharmacySearchResponseDTO> getAvailablePharmaciesPaginated(Pageable pageable) {

//        These are for the previous method.
//        Page<Pharmacy> pageResult = pharmacyRepository.findAll(pageable);
//        List<Pharmacy> filteredList = pageResult.getContent()
//                .stream()
//                .filter(pharmacy -> Boolean.TRUE.equals(pharmacy.getAvailable()))
//                .collect(Collectors.toList());
//
//        Page<Pharmacy> filteredPage = new PageImpl<>(
//                filteredList,
//                pageable,
//                filteredList.size()
//        );
//
//        Page<PharmacySearchResponseDTO> dtoPage =filteredPage.map(pharmacyMapper::toDto);

//        These are for the new current method.
        Page<Pharmacy> pageResult = pharmacyRepository. findByAvailableTrue(pageable);

        Page<PharmacySearchResponseDTO> dtoPage = pageResult.map(pharmacyMapper::toDto);

        return PaginatedResponse.from(dtoPage);
    }

    // ✅ SEARCH (DYNAMIC) --> This is for the previous way. In that way, the type is List.
    // ✅ SEARCH WITH PAGINATION
    @Override
    public PaginatedResponse<PharmacySearchResponseDTO> searchPharmacies(
            String location,
            String city,
            String pharmacyName,
            Pageable pageable
    ) {

//        This is for the old method.
        // If no filters → return all
//        if ((location == null || location.isEmpty()) && (city == null || city.isEmpty()) && (pharmacyName == null || pharmacyName.isEmpty())) {
//            return pharmacyRepository.findAll()
//                    .stream()
//                    .map(pharmacyMapper::toDto)
//                    .collect(Collectors.toList());
//        }

//        This is the new method.
//        ✅ Normalize inputs (convert empty/blank → null)
        location = (location == null || location.isBlank()) ? null : location.trim();
        city = (city == null || city.isBlank()) ? null : city.trim();
        pharmacyName = (pharmacyName == null || pharmacyName.isBlank()) ? null : pharmacyName.trim();

        Page<Pharmacy> pageResult;

        // ✅ If all are null → return all
        if (location == null && city == null && pharmacyName == null) {
//            These are for the old method.
//            return pharmacyRepository.findAll()
//                    .stream()
//                    .map(pharmacyMapper::toDto)
//                    .toList();

//            This is for the new method.
            pageResult = pharmacyRepository.findAll(pageable);
        } else {
            pageResult = pharmacyRepository.searchDynamic(location, city, pharmacyName, pageable);
        }

//        This is for the old method.
//        return pharmacyRepository.searchDynamic(location, city, pharmacyName)
//                .stream()
//                .map(pharmacyMapper::toDto)
////                .collect(Collectors.toList()) // This is for the old method.
//                .toList();

//        These are for the new method.
        Page<PharmacySearchResponseDTO> dtoPage = pageResult.map(pharmacyMapper::toDto);

        return PaginatedResponse.from(dtoPage);
    }

    // ✅ AVAILABLE PHARMACIES (assuming "available = true" field exists) --> This is for the old method. The type is List for that method.

    // ✅ GET AVAILABLE PHARMACIES (WITH PAGINATION) --> This is for the old method.
//    @Override
//    public PaginatedResponse<PharmacySearchResponseDTO> getAvailablePharmacies(Pageable pageable) {
//
////        This is for the old method.
////        return pharmacyRepository.findAll()
////                .stream()
////                .filter(pharmacy -> Boolean.TRUE.equals(pharmacy.getAvailable()))
////                .map(pharmacyMapper::toDto)
////                .collect(Collectors.toList());
//
//        Page<Pharmacy> pageResult = pharmacyRepository.findAll(pageable)
//                .map(pharmacy -> {
//                    if (Boolean.TRUE.equals(pharmacy.getAvailable())) {
//                        return pharmacy;
//                    }
//                    return null;
//                });
//
//        Page<PharmacySearchResponseDTO> dtoPage = pageResult.map(pharmacyMapper::toDto);
//
//        return PaginatedResponse.from(dtoPage);
//    }

    // ✅ CREATE
    @Override
    public PharmacySearchResponseDTO createPharmacy(PharmacyRequestDTO pharmacyRequestDTO) {
        Pharmacy pharmacy = pharmacyMapper.toEntity(pharmacyRequestDTO);
        Pharmacy savedPharmacy = pharmacyRepository.save(pharmacy);
        return pharmacyMapper.toDto(savedPharmacy);
    }

    // ✅ UPDATE
    @Override
    public PharmacySearchResponseDTO updatePharmacy(Long id, PharmacyRequestDTO pharmacyRequestDTO) {

        Pharmacy existingPharmacy = pharmacyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found with id: " + id));

        // Update fields manually OR via mapper
        existingPharmacy.setPharmacyName(pharmacyRequestDTO.getPharmacyName());
        existingPharmacy.setPharmacyLocation(pharmacyRequestDTO.getPharmacyLocation());
        existingPharmacy.setCity(pharmacyRequestDTO.getCity());
        existingPharmacy.setAvailable(pharmacyRequestDTO.getAvailable());

        Pharmacy updatedPharmacy = pharmacyRepository.save(existingPharmacy);

        return pharmacyMapper.toDto(updatedPharmacy);
    }

    // ✅ DELETE
    @Override
    public void deletePharmacy(Long id) {

        if (!pharmacyRepository.existsById(id)) {
            throw new RuntimeException("Pharmacy not found with id: " + id);
        }

        pharmacyRepository.deleteById(id);
    }
}
