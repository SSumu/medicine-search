package com.medicalsystem.medicine_search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PharmacyRequestDTO {

    private String pharmacyName;
    private String pharmacyLocation;
    private String city;
    private String country;
    private String contactNumber;
    private String email;
    private Boolean available;

    private List<PharmacyScheduleDTO> schedule;
}
