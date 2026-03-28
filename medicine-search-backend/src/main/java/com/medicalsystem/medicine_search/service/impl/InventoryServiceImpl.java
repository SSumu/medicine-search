package com.medicalsystem.medicine_search.service.impl;

import com.medicalsystem.medicine_search.entity.Inventory;
import com.medicalsystem.medicine_search.repository.InventoryRepository;
import com.medicalsystem.medicine_search.service.InventoryService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryServiceImpl(InventoryRepository inventoryRepository){
        this.inventoryRepository = inventoryRepository;
    }

    // ✅ Get all inventory
    @Override
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    // ✅ Get inventory by ID
    @Override
    public Inventory getInventoryById(Long id) {
        return inventoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));
    }

    // ✅ Search inventory by medicine name
    @Override
    public List<Inventory> searchByMedicineName(String name) {
        return inventoryRepository.findByMedicine_NameContainingIgnoreCase(name);
    }

    // ✅ Search inventory by location
    @Override
    public List<Inventory> searchByLocation(String location) {
        return inventoryRepository.findByPharmacy_LocationContainingIgnoreCase(location);
    }

    // ✅ Get available stock (quantity > 0)
    @Override
    public List<Inventory> getAvailableStock() {
        return inventoryRepository.findByQuantityGreaterThan(0);
    }

    // ✅ Save new inventory
    @Override
    public Inventory saveInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    // ✅ Update inventory
    @Override
    public Inventory updateInventory(Long id, Inventory inventory) {

        Inventory existingInventory = inventoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));

        // Update fields (example: medicine, pharmacy, quantity, price)
        existingInventory.setPharmacy(inventory.getPharmacy());
        existingInventory.setMedicine(inventory.getMedicine());
        existingInventory.setQuantity(inventory.getQuantity());
        existingInventory.setPrice(inventory.getPrice());
        existingInventory.setLastUpdated(LocalDateTime.now());

        return inventoryRepository.save(existingInventory);
    }

    // ✅ Delete inventory
    @Override
    public void deleteInventory(Long id) {
        Inventory existingInventory = inventoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));
        inventoryRepository.delete(existingInventory);
    }
}
