package com.medicalsystem.medicine_search.controller;

import com.medicalsystem.medicine_search.dto.PaginatedResponseDTO;
import com.medicalsystem.medicine_search.dto.PharmacyRequestDTO;
import com.medicalsystem.medicine_search.dto.PharmacySearchResponseDTO;
import com.medicalsystem.medicine_search.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pharmacies")
@RequiredArgsConstructor
@CrossOrigin
//@CrossOrigin(origins = "https://medicine-search-nine.vercel.app")
public class PharmacyController {

    private final PharmacyService pharmacyService;

    // ✅ Get all pharmacies
    @GetMapping("/get-all")
    public ResponseEntity<PaginatedResponseDTO<PharmacySearchResponseDTO>> getAllPharmacies(Pageable pageable) {
//        This is for the new frontend.
        return ResponseEntity.ok(pharmacyService.getAllPharmacies(pageable));
    }

    // ✅ PAGINATION (matches Angular getPharmaciesPaginated)
    @GetMapping
    public ResponseEntity<PaginatedResponseDTO<PharmacySearchResponseDTO>> getPaginatedPharmacies(
            @RequestParam int page,
            @RequestParam int size
    ) {
        return ResponseEntity.ok(
                pharmacyService.getPaginatedPharmacies(page, size)
        );
    }

    // ✅ Get pharmacy by ID
    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<PharmacySearchResponseDTO> getPharmacyById(@PathVariable Long id) {
        PharmacySearchResponseDTO pharmacy = pharmacyService.getPharmacyById(id);

        if (pharmacy == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(pharmacy);
    }

    // ✅ MAIN SEARCH (IMPORTANT - matches Angular searchPharmacies)
    @GetMapping("/search")
    public ResponseEntity<PaginatedResponseDTO<PharmacySearchResponseDTO>> searchPharmacies(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String pharmacyName,
            Pageable pageable) {
        return ResponseEntity.ok(
                pharmacyService.searchPharmacies(location, city, pharmacyName, pageable)
        );
    }

    // ✅ AVAILABLE PHARMACIES
    @GetMapping("/available")
    public ResponseEntity<List<PharmacySearchResponseDTO>> getAvailablePharmacies() {
        return ResponseEntity.ok(pharmacyService.getAvailablePharmacies());
    }

    // ✅ AVAILABLE PHARMACIES (PAGINATED VERSION)
    @GetMapping("/paginated/available")
    public ResponseEntity<PaginatedResponseDTO<PharmacySearchResponseDTO>> getAvailablePharmaciesPaginated(Pageable pageable) {

        PaginatedResponseDTO<PharmacySearchResponseDTO> response = pharmacyService.getAvailablePharmaciesPaginated(pageable);

        return ResponseEntity.ok(response);
    }

    // ✅ CREATE
    @PostMapping
    public ResponseEntity<PharmacySearchResponseDTO> createPharmacy(
            @RequestBody PharmacyRequestDTO pharmacyRequestDTO
    ) {
        return ResponseEntity.ok(pharmacyService.createPharmacy(pharmacyRequestDTO));
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<PharmacySearchResponseDTO> updatePharmacy(
            @PathVariable Long id,
            @RequestBody PharmacyRequestDTO pharmacyRequestDTO
    ) {
        return ResponseEntity.ok(pharmacyService.updatePharmacy(id, pharmacyRequestDTO));
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePharmacy(@PathVariable Long id) {
        pharmacyService.deletePharmacy(id);
        return ResponseEntity.noContent().build();
    }
}
