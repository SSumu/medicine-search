package com.medicalsystem.medicine_search.mapper;

import com.medicalsystem.medicine_search.dto.PharmacySearchResponseDTO;
import com.medicalsystem.medicine_search.entity.Pharmacy;
import org.springframework.stereotype.Component;

@Component
public class PharmacyMapper {

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
//                .latitude(pharmacy.getLatitude())
//                .longitude(pharmacy.getLongitude())
                .build();
    }
}
