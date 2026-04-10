package com.medicalsystem.medicine_search.service.impl;

import com.medicalsystem.medicine_search.dto.InventoryRequestDTO;
import com.medicalsystem.medicine_search.dto.InventoryResponseDTO;
import com.medicalsystem.medicine_search.entity.Inventory;
import com.medicalsystem.medicine_search.entity.Medicine;
import com.medicalsystem.medicine_search.entity.Pharmacy;
import com.medicalsystem.medicine_search.mapper.InventoryMapper;
import com.medicalsystem.medicine_search.repository.InventoryRepository;
import com.medicalsystem.medicine_search.repository.MedicineRepository;
import com.medicalsystem.medicine_search.repository.PharmacyRepository;
import com.medicalsystem.medicine_search.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.Repository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final MedicineRepository medicineRepository;
    private final PharmacyRepository pharmacyRepository;
    private final InventoryMapper inventoryMapper;

    // ✅ Get all inventory
    @Override
    public List<InventoryResponseDTO> getAllInventories() {
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
    public List<InventoryResponseDTO> getByPharmacy(Pharmacy pharmacyId) {

        return inventoryRepository.findByPharmacy(pharmacyId)
                .stream()
                .map(inventoryMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Get by medicine and pharmacy
//    @Override
//    public InventoryResponseDTO getByMedicineAndPharmacy(Medicine medicine, Pharmacy pharmacy) {
//
//        Inventory inventory = inventoryRepository
//                .findByMedicineAndPharmacy(medicine, pharmacy)
//                .orElseThrow(() -> new RuntimeException("Inventory not found"));
//
//        return inventoryMapper.toDto(inventory);
//    }

    // ✅ Search by medicine name sorted
    @Override
    public List<InventoryResponseDTO> searchByMedicineNameSorted(String medicineName) {

        return inventoryRepository
                .findByMedicine_MedicineNameContainingIgnoreCaseOrderByPriceAsc(medicineName)
                .stream()
                .map(inventoryMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Search by pharmacy name
    @Override
    public List<InventoryResponseDTO> searchByPharmacyName(String pharmacyName) {

        return inventoryRepository
                .findByPharmacy_PharmacyNameContainingIgnoreCase(pharmacyName)
                .stream()
                .map(inventoryMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Search by medicine name
    @Override
    public List<InventoryResponseDTO> searchByMedicineName(String medicineName) {
        return inventoryRepository
                .findByMedicine_MedicineNameContainingIgnoreCase(medicineName)
                .stream()
                .map(inventoryMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Search by location
    @Override
    public List<InventoryResponseDTO> searchByLocation(String location) {
        return inventoryRepository
                .findByPharmacy_PharmacyLocationContainingIgnoreCase(location)
                .stream()
                .map(inventoryMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Get available stock (quantity > 0)
    @Override
    public List<InventoryResponseDTO> getAvailableStock() {
        return inventoryRepository
                .findByQuantityGreaterThan(0)
                .stream()
                .map(inventoryMapper::toDto)
                .collect(Collectors.toList());
    }

//    // ✅ Save new inventory
//    @Override
//    public InventoryResponseDTO saveInventory(Inventory inventory) {
//        Inventory saved = inventoryRepository.save(inventory);
//        return inventoryMapper.toDto(saved);
//    }

    // ✅ Update inventory
    @Override
    public InventoryResponseDTO updateInventory(Long id, InventoryRequestDTO inventoryRequestDTO) {

        Inventory existingInventory = inventoryRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));

        // Fetch related entities
        Medicine medicine = medicineRepository
                .findById(inventoryRequestDTO.getMedicineId())
                .orElseThrow(() -> new RuntimeException("Medicine not found with id: " + inventoryRequestDTO.getMedicineId()));

        Pharmacy pharmacy = pharmacyRepository
                .findById(inventoryRequestDTO.getPharmacyId())
                .orElseThrow(() -> new RuntimeException("Pharmacy not found with id: " + inventoryRequestDTO.getPharmacyId()));

        // Update fields
        existingInventory.setMedicine(medicine);
        existingInventory.setPharmacy(pharmacy);
        existingInventory.setQuantity(inventoryRequestDTO.getQuantity());
        existingInventory.setPrice(inventoryRequestDTO.getPrice());
        existingInventory.setLastUpdated(LocalDateTime.now());

        Inventory updated = inventoryRepository
                .save(existingInventory);

        return inventoryMapper.toDto(updated);
    }

    // ✅ Delete inventory
    @Override
    public void deleteInventory(Long id) {

        Inventory existingInventory = inventoryRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));

        inventoryRepository.delete(existingInventory);
    }
}

