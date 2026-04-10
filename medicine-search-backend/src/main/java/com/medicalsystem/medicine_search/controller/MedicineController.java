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
    @GetMapping("/{medicineId}")
    public ResponseEntity<MedicineSearchResponseDTO> getMedicineByMedicineId ( @PathVariable Long medicineId ) {
        return medicineService.getMedicineByMedicineId( medicineId )
                .map(ResponseEntity::ok)   // if present, return 200 OK
                .orElseGet(() -> ResponseEntity.notFound().build()); // else return 404
    }

    // =====================================================
    // SEARCH BY NAME
    // =====================================================
    @GetMapping("/searchByName")
    public ResponseEntity<List<MedicineSearchResponseDTO>> searchByName ( @RequestParam String medicineName ) {
        return ResponseEntity.ok(medicineService.searchMedicinesByMedicineName( medicineName ));
    }

    // ========================================================
    // SEARCH BY NAME + PRICE RANGE (OPTIONAL - EXTRA FEATURE)
    // ========================================================
    @GetMapping("/searchWithPrice")
    public ResponseEntity<List<MedicineSearchResponseDTO>> searchMedicines (
            @RequestParam String name,
            @RequestParam double minPrice,
            @RequestParam double maxPrice
    ) {
        return ResponseEntity.ok(medicineService.searchMedicines(name, minPrice, maxPrice));
    }

    // =====================================================
    // FILTER BY PRICE RANGE
    // =====================================================
    @GetMapping("/filter")
    public ResponseEntity<List<MedicineSearchResponseDTO>> filterByPrice (
            @RequestParam double minPrice,
            @RequestParam double maxPrice
    ) {

        return ResponseEntity.ok(
                medicineService.getMedicinesByPriceRange(minPrice, maxPrice)
        );
    }

    // =====================================================
    // CREATE NEW MEDICINE
    // =====================================================
    @PostMapping
    public ResponseEntity<MedicineSearchResponseDTO> createMedicine( @RequestBody MedicineRequestDTO medicineRequestDTO ) {

        return ResponseEntity.status(201)
                .body(medicineService.saveMedicine(medicineRequestDTO));
    }

    // =====================================================
    // UPDATE MEDICINE
    // =====================================================
    @PutMapping("/{medicineId}")
    public ResponseEntity<MedicineSearchResponseDTO> updateMedicine(
            @PathVariable Long medicineId,
            @RequestBody MedicineRequestDTO medicineRequestDTO
    ) {

        return medicineService.updateMedicine( medicineId, medicineRequestDTO )
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // =====================================================
    // DELETE MEDICINE
    // =====================================================
    @DeleteMapping("/{medicineId}")
    public ResponseEntity<Void> deleteMedicine( @PathVariable Long medicineId ) {

        medicineService.deleteMedicine(medicineId);
        return ResponseEntity.noContent().build();
    }
}
