package com.medicalsystem.medicine_search.controller;

import com.medicalsystem.medicine_search.dto.PaginatedResponse;
import com.medicalsystem.medicine_search.dto.PharmacyRequestDTO;
import com.medicalsystem.medicine_search.dto.PharmacySearchResponseDTO;
import com.medicalsystem.medicine_search.service.PharmacyService;
import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
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

//    Previous type of this method is List.
    // ✅ Get all pharmacies
    @GetMapping("/get-all")
    public ResponseEntity<PaginatedResponse<PharmacySearchResponseDTO>> getAllPharmacies(Pageable pageable) {
//        This matches for the old frontend.
//        List<PharmacySearchResponseDTO> pharmacies = pharmacyService.getAllPharmacies();
//        return ResponseEntity.ok(pharmacies);

//        This is for the new frontend.
        return ResponseEntity.ok(pharmacyService.getAllPharmacies(pageable));
    }

//    This is for the old frontend.

//    // ✅ Search pharmacies by name
//    @GetMapping("/search/by-name")
//    public ResponseEntity<List<PharmacySearchResponseDTO>> searchByName(@RequestParam String name) {
//        return ResponseEntity.ok(pharmacyService.searchPharmaciesByName(name));
//    }
//
//    // ✅ Search pharmacies by city
//    @GetMapping("/search/by-city")
//    public ResponseEntity<List<PharmacySearchResponseDTO>> searchByCity(@RequestParam String city) {
//        return ResponseEntity.ok(pharmacyService.searchPharmaciesByCity(city));
//    }
//
//    // ✅ Search pharmacies by country
//    @GetMapping("/search/by-country")
//    public ResponseEntity<List<PharmacySearchResponseDTO>> searchByCountry(@RequestParam String country) {
//        return ResponseEntity.ok(pharmacyService.searchPharmaciesByCountry(country));
//    }
//
//    // ✅ Search pharmacies by name AND city
//    @GetMapping("/search/by-name-city")
//    public ResponseEntity<List<PharmacySearchResponseDTO>> searchByNameAndCity(
//            @RequestParam String name,
//            @RequestParam String city) {
//        return ResponseEntity.ok(pharmacyService.searchPharmaciesByNameAndCity(name, city));
//    }

//    This is for the new frontend.
//    Previously the type of this method is Page.
    // ✅ PAGINATION (matches Angular getPharmaciesPaginated)
    @GetMapping
    public ResponseEntity<PaginatedResponse<PharmacySearchResponseDTO>> getPaginatedPharmacies(
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

//    The Previous type of this method is List.
    // ✅ MAIN SEARCH (IMPORTANT - matches Angular searchPharmacies)
    @GetMapping("/search")
    public ResponseEntity<PaginatedResponse<PharmacySearchResponseDTO>> searchPharmacies(
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
    public ResponseEntity<PaginatedResponse<PharmacySearchResponseDTO>> getAvailablePharmaciesPaginated(Pageable pageable) {

        PaginatedResponse<PharmacySearchResponseDTO> response = pharmacyService.getAvailablePharmaciesPaginated(pageable);

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
