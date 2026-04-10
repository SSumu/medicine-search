package com.medicalsystem.medicine_search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PharmacyDTO {
    private Long pharmacyId;
    private String pharmacyName;
    private String pharmacyLocation;
}
