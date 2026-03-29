package com.medicalsystem.medicine_search.controller;

import com.medicalsystem.medicine_search.dto.MedicineSearchResponseDTO;
import com.medicalsystem.medicine_search.entity.Medicine;
import com.medicalsystem.medicine_search.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/medicines")
@RequiredArgsConstructor
@CrossOrigin(origins = "https://medicine-search-nine.vercel.app") // allow Angular frontend
public class MedicineController {

    private final MedicineService medicineService;

    // Get all medicines
    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    // Get medicine by ID
    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable Long id) {
        Optional<Medicine> medicine = medicineService.getMedicineById(id);
        return medicine.map(ResponseEntity::ok)   // if present, return 200 OK
                .orElseGet(() -> ResponseEntity.notFound().build()); // else return 404
    }

    // Search medicines by name
    @GetMapping("/search")
    public ResponseEntity<List<MedicineSearchResponseDTO>> searchMedicines(@RequestParam String name) {
        return ResponseEntity.ok(medicineService.searchMedicinesByName(name));
    }

    // Filter medicines by price range
    @GetMapping("/filter")
    public ResponseEntity<List<Medicine>> filterByPrice(
            @RequestParam double minPrice,
            @RequestParam double maxPrice) {
        return ResponseEntity.ok(
                medicineService.getMedicinesByPriceRange(minPrice, maxPrice)
        );
    }

    // Add new medicine
    @PostMapping
    public ResponseEntity<Medicine> createMedicine(@RequestBody Medicine medicine) {
        return ResponseEntity.ok(medicineService.saveMedicine(medicine));
    }

    // Update medicine
    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(
            @PathVariable Long id,
            @RequestBody Medicine medicine) {
        return ResponseEntity.ok(medicineService.updateMedicine(id, medicine));
    }

    // Delete medicine
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.noContent().build();
    }
}
