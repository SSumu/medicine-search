package com.medicalsystem.medicine_search.controller;

import com.medicalsystem.medicine_search.dto.InventoryResponseDTO;
import com.medicalsystem.medicine_search.entity.Inventory;
import com.medicalsystem.medicine_search.entity.Medicine;
import com.medicalsystem.medicine_search.entity.Pharmacy;
import com.medicalsystem.medicine_search.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*") // add your Vercel link here if needed
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    // ✅ Get all inventory
    @GetMapping("/get-all")
    public ResponseEntity<List<InventoryResponseDTO>> getAllInventory() {

        List<InventoryResponseDTO> response =
                inventoryService.getAllInventory();

        return ResponseEntity.ok(response);
    }

    // ✅ Get inventory by ID
    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<InventoryResponseDTO> getInventoryById(@PathVariable Long id) {

        InventoryResponseDTO response =
                inventoryService.getInventoryById(id);

        return ResponseEntity.ok(response);
    }

    // ✅ Search by medicine name
    @GetMapping("/search/by-medicine")
    public ResponseEntity<List<InventoryResponseDTO>> searchByMedicine(
            @RequestParam String name) {

        List<InventoryResponseDTO> response =
                inventoryService.searchByMedicineName(name);

        return ResponseEntity.ok(response);
    }

    // ✅ Search by location
    @GetMapping("/search/by-location")
    public ResponseEntity<List<InventoryResponseDTO>> searchByLocation(
            @RequestParam String location) {

        List<InventoryResponseDTO> response =
                inventoryService.searchByLocation(location);

        return ResponseEntity.ok(response);
    }

    // ✅ Get available stock (quantity > 0)
    @GetMapping("/available")
    public ResponseEntity<List<InventoryResponseDTO>> getAvailableStock() {

        List<InventoryResponseDTO> response =
                inventoryService.getAvailableStock();

        return ResponseEntity.ok(response);
    }

    // ✅ Get by medicine
    @GetMapping("/medicine/{medicineId}")
    public List<InventoryResponseDTO> getByMedicine(@PathVariable Medicine medicineId) {
        return inventoryService.getByMedicine(medicineId);
    }

    // ✅ Get by pharmacy
    @GetMapping("/pharmacy/{pharmacyId}")
    public List<InventoryResponseDTO> getByPharmacy(@PathVariable Pharmacy pharmacyId) {
        return inventoryService.getByPharmacy(pharmacyId);
    }

    // ✅ Get by medicine and pharmacy
    @GetMapping("/search/medicine-pharmacy")
    public InventoryResponseDTO getByMedicineAndPharmacy(
            @RequestParam Medicine medicineId,
            @RequestParam Pharmacy pharmacyId) {
        return inventoryService.getByMedicineAndPharmacy(medicineId, pharmacyId);
    }

    // ✅ Search by medicine name sorted
    @GetMapping("/search/sorted")
    public List<InventoryResponseDTO> searchByMedicineNameSorted(
            @RequestParam String name) {
        return inventoryService.searchByMedicineNameSorted(name);
    }

    // ✅ Create new inventory
    @PostMapping("/create")
    public ResponseEntity<InventoryResponseDTO> createInventory(
            @RequestBody Inventory inventory) {

        InventoryResponseDTO response =
                inventoryService.saveInventory(inventory);

        return ResponseEntity.ok(response);
    }

    // ✅ Update inventory
    @PutMapping("update/{id}")
    public ResponseEntity<InventoryResponseDTO> updateInventory(
            @PathVariable Long id,
            @RequestBody Inventory inventory) {

        InventoryResponseDTO response =
                inventoryService.updateInventory(id, inventory);

        return ResponseEntity.ok(response);
    }

    // ✅ Delete inventory
    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {

        inventoryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }
}