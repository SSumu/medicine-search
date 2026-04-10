package com.medicalsystem.medicine_search.service.impl;

import com.medicalsystem.medicine_search.dto.PharmacySearchResponseDTO;
import com.medicalsystem.medicine_search.mapper.PharmacyMapper;
import com.medicalsystem.medicine_search.repository.PharmacyRepository;
import com.medicalsystem.medicine_search.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PharmacyServiceImpl implements PharmacyService {

    private final PharmacyRepository pharmacyRepository;
    private final PharmacyMapper pharmacyMapper;

    @Override
    public List<PharmacySearchResponseDTO> getAllPharmacies() {
        return pharmacyRepository.findAll()
                .stream()
                .map(pharmacyMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PharmacySearchResponseDTO getPharmacyById(Long id) {
        return pharmacyRepository.findById(id)
                .map(pharmacyMapper::toDto)
                .orElse(null);
    }

    @Override
    public List<PharmacySearchResponseDTO> searchPharmaciesByName(String pharmacyName) {
        return pharmacyRepository.findByPharmacyNameContainingIgnoreCase(pharmacyName)
                .stream()
                .map(pharmacyMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PharmacySearchResponseDTO> searchPharmaciesByCity(String city) {
        return pharmacyRepository.findByCityContainingIgnoreCase(city)
                .stream()
                .map(pharmacyMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PharmacySearchResponseDTO> searchPharmaciesByCountry(String country) {
        return pharmacyRepository.findByCountryContainingIgnoreCase(country)
                .stream()
                .map(pharmacyMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PharmacySearchResponseDTO> searchPharmaciesByNameAndCity(String pharmacyName, String city) {
        return pharmacyRepository.findByPharmacyNameContainingIgnoreCaseAndCityContainingIgnoreCase(pharmacyName, city)
                .stream()
                .map(pharmacyMapper::toDto)
                .collect(Collectors.toList());
    }
}
