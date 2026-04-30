package com.medicalsystem.medicine_search.service.impl;

import com.medicalsystem.medicine_search.dto.PaginatedResponseDTO;
import com.medicalsystem.medicine_search.dto.PharmacyRequestDTO;
import com.medicalsystem.medicine_search.dto.PharmacySearchResponseDTO;
import com.medicalsystem.medicine_search.entity.Pharmacy;
import com.medicalsystem.medicine_search.mapper.PharmacyMapper;
import com.medicalsystem.medicine_search.repository.PharmacyRepository;
import com.medicalsystem.medicine_search.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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

    // ✅ GET ALL WITH PAGINATION
    @Override
    public PaginatedResponseDTO<PharmacySearchResponseDTO> getAllPharmacies(Pageable pageable) {

        Page<Pharmacy> pharmacyPage = pharmacyRepository.findAllWithSchedule(pageable);

        //        This is the old method for the old conditions.
//        List<PharmacySearchResponseDTO> dtoList = pharmacyPage
//                .getContent()
//                .stream()
//                .map(pharmacyMapper::toDto)
//                .toList();

//        This is the old method for the old conditions.
//        return new PaginatedResponse<>(
//                dtoList,
//                pharmacyPage.getNumber(),
////                pharmacyPage.getSize(),
//                pharmacyPage.getTotalElements(),
//                pharmacyPage.getTotalPages()
//        );

        //        This is the new method for the new conditions ( Frontend conditions ).
        return PaginatedResponseDTO.from(pharmacyPage.map(pharmacyMapper::toDto));
    }

    // ✅ GET PHARMACY BY ID
    @Override
    public PharmacySearchResponseDTO getPharmacyById(Long id) {
        return pharmacyRepository.findById(id)
                .map(pharmacyMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Pharmacy not found with id: " + id));
    }

    // ✅ PAGINATION USING PAGE & SIZE (INTERFACE METHOD)
    @Override
    public PaginatedResponseDTO<PharmacySearchResponseDTO> getPaginatedPharmacies(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Pharmacy> pageResult = pharmacyRepository.findAll(pageable);

        Page<PharmacySearchResponseDTO> dtoPage = pageResult.map(pharmacyMapper::toDto);

        return PaginatedResponseDTO.from(dtoPage);
    }

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
    public PaginatedResponseDTO<PharmacySearchResponseDTO> getAvailablePharmaciesPaginated(Pageable pageable) {

//        These are for the new current method.
        Page<Pharmacy> pageResult = pharmacyRepository. findByAvailableTrue(pageable);

        Page<PharmacySearchResponseDTO> dtoPage = pageResult.map(pharmacyMapper::toDto);

        return PaginatedResponseDTO.from(dtoPage);
    }

    // ✅ SEARCH (DYNAMIC)
    // ✅ SEARCH WITH PAGINATION
    @Override
    public PaginatedResponseDTO<PharmacySearchResponseDTO> searchPharmacies(
            String location,
            String city,
            String pharmacyName,
            Pageable pageable
    ) {


//        ✅ Normalize inputs (convert empty/blank → null)
        location = (location == null || location.isBlank()) ? null : location.trim();
        city = (city == null || city.isBlank()) ? null : city.trim();
        pharmacyName = (pharmacyName == null || pharmacyName.isBlank()) ? null : pharmacyName.trim();

        Page<Pharmacy> pageResult;

        // ✅ If all are null → return all
        if (location == null && city == null && pharmacyName == null) {

            pageResult = pharmacyRepository.findAll(pageable);
        } else {
            pageResult = pharmacyRepository.searchDynamic(location, city, pharmacyName, pageable);
        }

        Page<PharmacySearchResponseDTO> dtoPage = pageResult.map(pharmacyMapper::toDto);

        return PaginatedResponseDTO.from(dtoPage);
    }

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
        existingPharmacy.setCountry(pharmacyRequestDTO.getCountry());
        existingPharmacy.setContactNumber(pharmacyRequestDTO.getContactNumber());
        existingPharmacy.setEmail(pharmacyRequestDTO.getEmail());
        existingPharmacy.setAvailable(pharmacyRequestDTO.getAvailable());
        existingPharmacy.setSchedule(pharmacyRequestDTO.getSchedule());

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
