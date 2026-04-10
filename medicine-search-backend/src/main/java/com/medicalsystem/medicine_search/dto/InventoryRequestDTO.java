package com.medicalsystem.medicine_search.dto;

import lombok.Data;

@Data
public class InventoryRequestDTO {

    private Long pharmacyId;
    private Long medicineId;

    private Integer quantity;
    private Double price;
}
