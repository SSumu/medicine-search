package com.medicalsystem.medicine_search.controller;

import com.medicalsystem.medicine_search.dto.InventoryResponseDTO;
import com.medicalsystem.medicine_search.entity.Inventory;
import com.medicalsystem.medicine_search.mapper.InventoryMapper;
import com.medicalsystem.medicine_search.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/inventory")
@CrossOrigin(origins = "https://medicine-search-nine.vercel.app/")
public class InventoryController {

    private final InventoryService inventoryService;
    private final InventoryMapper inventoryMapper;

    public InventoryController(InventoryService inventoryService, InventoryMapper inventoryMapper) {
        this.inventoryService = inventoryService;
        this.inventoryMapper = inventoryMapper;
    }

    // ✅ Get all inventory
    @GetMapping
    public ResponseEntity<List<InventoryResponseDTO>> getAllInventory() {

        List<Inventory> inventories = inventoryService.getAllInventory();

        // Map entity to DTO
        List<InventoryResponseDTO> responseDTOS = inventories.stream()
                .map(inventoryMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOS);
    }

    // ✅ Get inventory by ID
    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponseDTO> getInventoryById(@PathVariable Long id) {

        Inventory inventory = inventoryService.getInventoryById(id);
        InventoryResponseDTO responseDTO = inventoryMapper.toDto(inventory);

        return ResponseEntity.ok(responseDTO);
    }

    // ✅ Search by medicine name
    @GetMapping("/search/medicine")
    public ResponseEntity<List<InventoryResponseDTO>> searchByMedicine(
            @RequestParam String name) {

        List<Inventory> inventories = inventoryService.searchByMedicineName(name);

        List<InventoryResponseDTO> responseDTOS = inventories.stream()
                .map(inventoryMapper::toDto)
                .toList();

        return ResponseEntity.ok(responseDTOS);
    }

    // ✅ Search by pharmacy location
    @GetMapping("/search/location")
    public ResponseEntity<List<InventoryResponseDTO>> searchByLocation(
            @RequestParam String location) {

        List<Inventory> inventories = inventoryService.searchByLocation(location);

        List<InventoryResponseDTO> responseDTOS = inventories.stream()
                .map(inventoryMapper::toDto)
                .toList();

        return ResponseEntity.ok(responseDTOS);
    }

    // ✅ Get only available stock (quantity > 0)
    @GetMapping("/available")
    public ResponseEntity<List<InventoryResponseDTO>> getAvailableStock() {

        List<Inventory> inventories = inventoryService.getAvailableStock();

        List<InventoryResponseDTO> responseDTOS = inventories.stream()
                .map(inventoryMapper::toDto)
                .toList();

        return ResponseEntity.ok(responseDTOS);
    }

    // ✅ Create new inventory
    @PostMapping
    public ResponseEntity<InventoryResponseDTO> createInventory(@RequestBody Inventory inventory) {

        Inventory savedInventory = inventoryService.saveInventory(inventory);

        InventoryResponseDTO responseDTO = inventoryMapper.toDto(savedInventory);

        return ResponseEntity.ok(responseDTO);
    }

    // ✅ Update inventory
    @PutMapping("/{id}")
    public ResponseEntity<InventoryResponseDTO> updateInventory(
            @PathVariable Long id,
            @RequestBody Inventory inventory) {

        Inventory updatedInventory = inventoryService.updateInventory(id, inventory);

        InventoryResponseDTO responseDTO = inventoryMapper.toDto(updatedInventory);

        return ResponseEntity.ok(responseDTO);
    }

    // ✅ Delete inventory
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {

        inventoryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }
}
