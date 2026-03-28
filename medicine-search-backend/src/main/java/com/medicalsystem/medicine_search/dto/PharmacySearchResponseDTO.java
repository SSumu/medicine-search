package com.medicalsystem.medicine_search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PharmacySearchResponseDTO {

    private Long id;
    private String name;
    private String location;
    private String city;
    private String country;
    private String contactNumber;
    private String email;
    private Double latitude;
    private Double longitude;
}
