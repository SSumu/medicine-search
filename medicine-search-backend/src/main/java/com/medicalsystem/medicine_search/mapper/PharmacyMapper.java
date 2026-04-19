package com.medicalsystem.medicine_search.mapper;

import com.medicalsystem.medicine_search.dto.PharmacyRequestDTO;
import com.medicalsystem.medicine_search.dto.PharmacySearchResponseDTO;
import com.medicalsystem.medicine_search.entity.Pharmacy;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PharmacyMapper {

    // ENTITY → DTO
    public PharmacySearchResponseDTO toDto(Pharmacy pharmacy){
        if (pharmacy == null){
            return null;
        }

        return PharmacySearchResponseDTO.builder()
                .id(pharmacy.getPharmacyId())
                .name(pharmacy.getPharmacyName())
                .location(pharmacy.getPharmacyLocation())
                .city(pharmacy.getCity())
                .country(pharmacy.getCountry())
                .contactNumber(pharmacy.getContactNumber())
                .email(pharmacy.getEmail())
                .lastUpdated(pharmacy.getLastUpdated())
                .build();
    }

    // DTO → ENTITY
    public Pharmacy toEntity(PharmacyRequestDTO pharmacyRequestDTO) {
        if (pharmacyRequestDTO == null) {
            return null;
        }

        return Pharmacy.builder()
                .pharmacyName(pharmacyRequestDTO.getPharmacyName())
                .pharmacyLocation(pharmacyRequestDTO.getPharmacyLocation())
                .city(pharmacyRequestDTO.getCity())
                .country(pharmacyRequestDTO.getCountry())
                .email(pharmacyRequestDTO.getEmail())
                .available(pharmacyRequestDTO.getAvailable())
                .lastUpdated(LocalDateTime.now())
                .build();
    }
}
