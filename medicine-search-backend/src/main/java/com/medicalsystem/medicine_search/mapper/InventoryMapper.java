package com.medicalsystem.medicine_search.mapper;

import com.medicalsystem.medicine_search.dto.InventoryResponseDTO;
import com.medicalsystem.medicine_search.entity.Inventory;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public InventoryResponseDTO toDto(Inventory inventory) {

        if (inventory == null) {
            return null;
        }

        return InventoryResponseDTO.builder()
                .id(inventory.getId())

                .pharmacyName(
                        inventory.getPharmacy() != null
                                ? inventory.getPharmacy().getName()
                                : null
                )
                .pharmacyLocation(
                        inventory.getPharmacy() != null
                                ? inventory.getPharmacy().getLocation()
                                : null
                )

                .medicineName(
                        inventory.getMedicine() != null
                                ? inventory.getMedicine().getName()
                                : null
                )

                .quantity(inventory.getQuantity())
                .price(inventory.getPrice())
                .lastUpdated(inventory.getLastUpdated())

                .build();
    }
}