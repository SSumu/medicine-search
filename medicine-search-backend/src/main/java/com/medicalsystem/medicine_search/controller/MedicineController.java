package com.medicalsystem.medicine_search.controller;

import com.medicalsystem.medicine_search.dto.MedicineSearchResponseDTO;
import com.medicalsystem.medicine_search.entity.Medicine;
import com.medicalsystem.medicine_search.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicine")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    // Get all medicines
    @GetMapping
    public ResponseEntity<List<MedicineSearchResponseDTO>> getAllMedicines() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    // Get medicine by ID
    @GetMapping("/{id}")
    public ResponseEntity<MedicineSearchResponseDTO> getMedicineById(@PathVariable Long id) {
//        Optional<Medicine> medicine = medicineService.getMedicineById(id);
        return medicineService.getMedicineById(id)
                .map(ResponseEntity::ok)   // if present, return 200 OK
                .orElseGet(() -> ResponseEntity.notFound().build()); // else return 404
    }

    // Search medicines by name
    @GetMapping("/searchByName")
    public ResponseEntity<List<MedicineSearchResponseDTO>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(medicineService.searchMedicinesByName(name));
    }

    // Search medicines by name
    @GetMapping("/search")
    public ResponseEntity<List<MedicineSearchResponseDTO>> searchMedicines(@RequestParam String name, @RequestParam double minPrice, @RequestParam double maxPrice) {
        List<MedicineSearchResponseDTO> result = medicineService.searchMedicines(name, minPrice, maxPrice);

        return ResponseEntity.ok(result);
    }

    // Filter medicines by price range
    @GetMapping("/filter")
    public ResponseEntity<List<MedicineSearchResponseDTO>> filterByPrice(
            @RequestParam double minPrice,
            @RequestParam double maxPrice) {
        return ResponseEntity.ok(
                medicineService.getMedicinesByPriceRange(minPrice, maxPrice)
        );
    }

    // Add new medicine
    @PostMapping
    public ResponseEntity<MedicineSearchResponseDTO> createMedicine(@RequestBody Medicine medicine) {
        return ResponseEntity.status(201)
                .body(medicineService.saveMedicine(medicine));
    }

    // Update medicine
    @PutMapping("/{id}")
    public ResponseEntity<MedicineSearchResponseDTO> updateMedicine(
            @PathVariable Long id,
            @RequestBody Medicine medicine) {
        return medicineService.updateMedicine(id, medicine)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete medicine
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.noContent().build();
    }
}
