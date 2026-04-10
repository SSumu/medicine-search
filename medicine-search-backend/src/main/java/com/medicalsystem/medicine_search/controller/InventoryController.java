package com.medicalsystem.medicine_search.controller;

import com.medicalsystem.medicine_search.dto.InventoryRequestDTO;
import com.medicalsystem.medicine_search.dto.InventoryResponseDTO;
import com.medicalsystem.medicine_search.entity.Inventory;
import com.medicalsystem.medicine_search.entity.Pharmacy;
import com.medicalsystem.medicine_search.repository.InventoryRepository;
import com.medicalsystem.medicine_search.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    // ✅ GET ALL INVENTORIES (matches Angular: GET /inventory)
    @GetMapping
    public ResponseEntity<List<InventoryResponseDTO>> getAllInventories() {
        return ResponseEntity.ok(inventoryService.getAllInventories());
    }

    // ✅ SEARCH BY MEDICINE NAME (matches Angular)
    @GetMapping("/search/medicine")
    public ResponseEntity<List<InventoryResponseDTO>> searchByMedicineName( @RequestParam String medicineName ) {

        return ResponseEntity.ok( inventoryService.searchByMedicineName ( medicineName ) );

    }

    // ✅ SEARCH BY LOCATION (matches Angular)
    @GetMapping("/search/location")
    public ResponseEntity<List<InventoryResponseDTO>> searchByLocation(@RequestParam String location) {

        return ResponseEntity.ok( inventoryService.searchByLocation( location ) );

    }

    // ✅ GET AVAILABLE STOCK (quantity > 0)
    @GetMapping("/available")
    public ResponseEntity<List<InventoryResponseDTO>> getAvailableStock() {

        return ResponseEntity.ok( inventoryService.getAvailableStock() );
    }

    // ✅ SEARCH BY PHARMACY NAME
    @GetMapping("/search/pharmacy")
    public ResponseEntity<List<InventoryResponseDTO>> searchByPharmacyName(@RequestParam String pharmacyName) {

        return ResponseEntity.ok(inventoryService.searchByPharmacyName(pharmacyName));

    }

    // ✅ SEARCH BY MEDICINE AND PHARMACY
//    @GetMapping("/search/medicine-pharmacy")
//    public InventoryResponseDTO searchByMedicineAndPharmacy(
//            @RequestParam Medicine medicineName,
//            @RequestParam Pharmacy pharmacyName) {
//        return inventoryService.getByMedicineAndPharmacy(medicineName, pharmacyName);
//    }

    // ✅ SEARCH BY MEDICINE NAME SORTED
    @GetMapping("/search/medicineNameSorted")
    public ResponseEntity<List<InventoryResponseDTO>> searchByMedicineNameSorted(@RequestParam String medicineName) {

        return ResponseEntity.ok(inventoryService.searchByMedicineNameSorted(medicineName));
    }

//    @GetMapping("/search/pharmacy")
//    public List<Inventory> searchByPharmacy(@RequestParam String pharmacyName) {
//        return inventoryRepository
//    }

    // ✅ UPDATE INVENTORY
    @PutMapping("/{id}")
    public ResponseEntity<InventoryResponseDTO> updateInventory(
            @PathVariable Long id,
            @RequestBody InventoryRequestDTO inventoryRequestDTO) {

        return ResponseEntity.ok(inventoryService.updateInventory(id, inventoryRequestDTO));
    }

    // ✅ Delete inventory
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {

        inventoryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }
}