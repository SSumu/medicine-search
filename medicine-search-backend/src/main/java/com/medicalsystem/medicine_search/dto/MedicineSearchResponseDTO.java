package com.medicalsystem.medicine_search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MedicineSearchResponseDTO {

    private Long medicineId;
    private String medicineName;
    private String manufacturer;
    private Integer quantity;
    private Double price;
    private String description;
    private LocalDateTime lastUpdated;
}
