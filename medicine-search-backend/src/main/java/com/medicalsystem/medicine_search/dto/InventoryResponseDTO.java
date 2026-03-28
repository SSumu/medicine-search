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
public class InventoryResponseDTO {

    private Long id;

    private String pharmacyName;
    private String pharmacyLocation;

    private String medicineName;

    private Integer quantity;
    private Double price;

    private LocalDateTime lastUpdated;
}
