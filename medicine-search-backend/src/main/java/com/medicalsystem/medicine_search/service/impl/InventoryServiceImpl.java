package com.medicalsystem.medicine_search.service.impl;

import com.medicalsystem.medicine_search.dto.InventoryResponseDTO;
import com.medicalsystem.medicine_search.entity.Inventory;
import com.medicalsystem.medicine_search.entity.Medicine;
import com.medicalsystem.medicine_search.entity.Pharmacy;
import com.medicalsystem.medicine_search.mapper.InventoryMapper;
import com.medicalsystem.medicine_search.repository.InventoryRepository;
import com.medicalsystem.medicine_search.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryMapper inventoryMapper;

    // ✅ Get all inventory
    @Override
    public List<InventoryResponseDTO> getAllInventory() {
        return inventoryRepository.findAll()
                .stream()
                .map(inventoryMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Get inventory by ID
    @Override
    public InventoryResponseDTO getInventoryById(Long id) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));

        return inventoryMapper.toDto(inventory);
    }

    // ✅ Get by medicine
    @Override
    public List<InventoryResponseDTO> getByMedicine(Medicine medicineId) {

        return inventoryRepository.findByMedicine(medicineId)
                .stream()
                .map(inventoryMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Get by pharmacy
    @Override
    public List<InventoryResponseDTO> getByPharmacy(Pharmacy pharmacy) {

        return inventoryRepository.findByPharmacy(pharmacy)
                .stream()
                .map(inventoryMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Get by medicine and pharmacy
    @Override
    public InventoryResponseDTO getByMedicineAndPharmacy(Medicine medicine, Pharmacy pharmacy) {

        Inventory inventory = inventoryRepository
                .findByMedicineAndPharmacy(medicine, pharmacy)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        return inventoryMapper.toDto(inventory);
    }

    // ✅ Search by medicine name sorted
    @Override
    public List<InventoryResponseDTO> searchByMedicineNameSorted(String name) {

        return inventoryRepository
                .findByMedicine_NameContainingIgnoreCaseOrderByPriceAsc(name)
                .stream()
                .map(inventoryMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Search by medicine name
    @Override
    public List<InventoryResponseDTO> searchByMedicineName(String name) {
        return inventoryRepository.findByMedicine_NameContainingIgnoreCase(name)
                .stream()
                .map(inventoryMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Search by location
    @Override
    public List<InventoryResponseDTO> searchByLocation(String location) {
        return inventoryRepository.findByPharmacy_LocationContainingIgnoreCase(location)
                .stream()
                .map(inventoryMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Get available stock (quantity > 0)
    @Override
    public List<InventoryResponseDTO> getAvailableStock() {
        return inventoryRepository.findByQuantityGreaterThan(0)
                .stream()
                .map(inventoryMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Save new inventory
    @Override
    public InventoryResponseDTO saveInventory(Inventory inventory) {
        Inventory saved = inventoryRepository.save(inventory);
        return inventoryMapper.toDto(saved);
    }

    // ✅ Update inventory
    @Override
    public InventoryResponseDTO updateInventory(Long id, Inventory inventory) {

        Inventory existingInventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));

        existingInventory.setPharmacy(inventory.getPharmacy());
        existingInventory.setMedicine(inventory.getMedicine());
        existingInventory.setQuantity(inventory.getQuantity());
        existingInventory.setPrice(inventory.getPrice());
        existingInventory.setLastUpdated(LocalDateTime.now());

        Inventory updated = inventoryRepository.save(existingInventory);

        return inventoryMapper.toDto(updated);
    }

    // ✅ Delete inventory
    @Override
    public void deleteInventory(Long id) {

        Inventory existingInventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));

        inventoryRepository.delete(existingInventory);
    }
}