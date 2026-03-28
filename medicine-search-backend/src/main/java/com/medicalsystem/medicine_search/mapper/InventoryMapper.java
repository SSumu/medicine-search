package com.medicalsystem.medicine_search.mapper;

import com.medicalsystem.medicine_search.dto.InventoryResponseDTO;
import com.medicalsystem.medicine_search.entity.Inventory;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public InventoryResponseDTO toDto(Inventory inventory) {
        return InventoryResponseDTO.builder()
                .id(inventory.getId())
                .pharmacyName(inventory.getPharmacy().getName())
                .pharmacyLocation(inventory.getPharmacy().getLocation())
                .medicineName(inventory.getMedicine().getName())
                .quantity(inventory.getQuantity())
                .price(inventory.getPrice())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }
}
