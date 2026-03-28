package com.medicalsystem.medicine_search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MedicineSearchResponseDTO {

    private Long medicineId;
    private String medicineName;
    private String description;
    private String manufacturer;

    private Double price;
    private Integer quantityAvailable;

    // Pharmacy Details
    private Long pharmacyId;
    private String pharmacyName;
    private String pharmacyAddress;

    // Location (for Google Maps)
    private Double latitude;
    private Double longitude;

    // Availability
    private Boolean availableLocally;
    private Boolean availableInternationally;
}
