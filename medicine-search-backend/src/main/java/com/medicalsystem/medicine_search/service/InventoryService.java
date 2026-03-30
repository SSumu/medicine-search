package com.medicalsystem.medicine_search.service;

import com.medicalsystem.medicine_search.dto.InventoryResponseDTO;
import com.medicalsystem.medicine_search.entity.Inventory;
import com.medicalsystem.medicine_search.entity.Medicine;
import com.medicalsystem.medicine_search.entity.Pharmacy;

import java.util.List;

public interface InventoryService {

    List<InventoryResponseDTO> getByMedicine(Medicine medicineId);

    List<InventoryResponseDTO> getByPharmacy(Pharmacy pharmacyId);

    InventoryResponseDTO getByMedicineAndPharmacy(Medicine medicineId, Pharmacy pharmacyId);

    List<InventoryResponseDTO> searchByMedicineNameSorted(String name);

    List<InventoryResponseDTO> getAllInventory();

    InventoryResponseDTO getInventoryById(Long id);

    List<InventoryResponseDTO> searchByMedicineName(String name);

    List<InventoryResponseDTO> searchByLocation(String location);

    List<InventoryResponseDTO> getAvailableStock();

    InventoryResponseDTO saveInventory(Inventory inventory);

    InventoryResponseDTO updateInventory(Long id, Inventory inventory);

    void deleteInventory(Long id);
}