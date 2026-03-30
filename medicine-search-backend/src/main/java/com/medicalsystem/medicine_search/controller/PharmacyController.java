package com.medicalsystem.medicine_search.controller;

import com.medicalsystem.medicine_search.dto.PharmacySearchResponseDTO;
import com.medicalsystem.medicine_search.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pharmacies")
@RequiredArgsConstructor
@CrossOrigin(origins = "https://medicine-search-nine.vercel.app")
public class PharmacyController {

    private final PharmacyService pharmacyService;

    // ✅ Get all pharmacies
    @GetMapping("/get-all")
    public ResponseEntity<List<PharmacySearchResponseDTO>> getAllPharmacies() {
        List<PharmacySearchResponseDTO> pharmacies = pharmacyService.getAllPharmacies();
        return ResponseEntity.ok(pharmacies);
    }

    // ✅ Get pharmacy by ID
    @GetMapping("get-by-id/{id}")
    public ResponseEntity<PharmacySearchResponseDTO> getPharmacyById(@PathVariable Long id) {
        PharmacySearchResponseDTO pharmacy = pharmacyService.getPharmacyById(id);
        if (pharmacy == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pharmacy);
    }

    // ✅ Search pharmacies by name
    @GetMapping("/search/by-name")
    public ResponseEntity<List<PharmacySearchResponseDTO>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(pharmacyService.searchPharmaciesByName(name));
    }

    // ✅ Search pharmacies by city
    @GetMapping("/search/by-city")
    public ResponseEntity<List<PharmacySearchResponseDTO>> searchByCity(@RequestParam String city) {
        return ResponseEntity.ok(pharmacyService.searchPharmaciesByCity(city));
    }

    // ✅ Search pharmacies by country
    @GetMapping("/search/by-country")
    public ResponseEntity<List<PharmacySearchResponseDTO>> searchByCountry(@RequestParam String country) {
        return ResponseEntity.ok(pharmacyService.searchPharmaciesByCountry(country));
    }

    // ✅ Search pharmacies by name AND city
    @GetMapping("/search/by-name-city")
    public ResponseEntity<List<PharmacySearchResponseDTO>> searchByNameAndCity(
            @RequestParam String name,
            @RequestParam String city) {
        return ResponseEntity.ok(pharmacyService.searchPharmaciesByNameAndCity(name, city));
    }
}
