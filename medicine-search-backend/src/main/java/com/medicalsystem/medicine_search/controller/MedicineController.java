package com.medicalsystem.medicine_search.controller;

import com.medicalsystem.medicine_search.dto.MedicineRequestDTO;
import com.medicalsystem.medicine_search.dto.MedicineSearchResponseDTO;
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

    // =====================================================
    // GET ALL MEDICINES
    // =====================================================
    @GetMapping
    public ResponseEntity<List<MedicineSearchResponseDTO>> getAllMedicines() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    // =====================================================
    // GET MEDICINE BY ID
    // =====================================================
    @GetMapping("/{id}")
    public ResponseEntity<MedicineSearchResponseDTO> getMedicineById(@PathVariable Long id) {
//        Optional<Medicine> medicine = medicineService.getMedicineById(id);
        return medicineService.getMedicineById(id)
                .map(ResponseEntity::ok)   // if present, return 200 OK
                .orElseGet(() -> ResponseEntity.notFound().build()); // else return 404
    }

    // =====================================================
    // SEARCH BY NAME
    // =====================================================
    @GetMapping("/searchByName")
    public ResponseEntity<List<MedicineSearchResponseDTO>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(medicineService.searchMedicinesByName(name));
    }

    // =====================================================
    // SEARCH BY NAME + PRICE RANGE
    // =====================================================
    @GetMapping("/search")
    public ResponseEntity<List<MedicineSearchResponseDTO>> searchMedicines(@RequestParam String name, @RequestParam double minPrice, @RequestParam double maxPrice) {
//        List<MedicineSearchResponseDTO> result = medicineService.searchMedicines(name, minPrice, maxPrice);
//
//        return ResponseEntity.ok(result);

        return ResponseEntity.ok(medicineService.searchMedicines(name, minPrice, maxPrice));
    }

    // =====================================================
    // FILTER BY PRICE RANGE
    // =====================================================
    @GetMapping("/filter")
    public ResponseEntity<List<MedicineSearchResponseDTO>> filterByPrice(
            @RequestParam double minPrice,
            @RequestParam double maxPrice) {

        return ResponseEntity.ok(
                medicineService.getMedicinesByPriceRange(minPrice, maxPrice)
        );
    }

    // =====================================================
    // CREATE NEW MEDICINE
    // =====================================================
    @PostMapping
    public ResponseEntity<MedicineSearchResponseDTO> createMedicine(@RequestBody MedicineRequestDTO medicineRequestDTO) {

        return ResponseEntity.status(201)
                .body(medicineService.saveMedicine(medicineRequestDTO));
    }

    // =====================================================
    // UPDATE MEDICINE
    // =====================================================
    @PutMapping("/{id}")
    public ResponseEntity<MedicineSearchResponseDTO> updateMedicine(
            @PathVariable Long id,
            @RequestBody MedicineRequestDTO medicineRequestDTO) {

        return medicineService.updateMedicine(id, medicineRequestDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // =====================================================
    // DELETE MEDICINE
    // =====================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {

        medicineService.deleteMedicine(id);
        return ResponseEntity.noContent().build();
    }
}
