package com.medicalsystem.medicine_search.service.impl;

import com.medicalsystem.medicine_search.dto.MedicineRequestDTO;
import com.medicalsystem.medicine_search.dto.MedicineSearchResponseDTO;
import com.medicalsystem.medicine_search.entity.Medicine;
import com.medicalsystem.medicine_search.mapper.MedicineMapper;
import com.medicalsystem.medicine_search.repository.MedicineRepository;
import com.medicalsystem.medicine_search.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;
    private final MedicineMapper medicineMapper; // ✅ Injected

    // ======================
    // ✅ GET ALL MEDICINES
    // ======================
    @Override
    public List<MedicineSearchResponseDTO> getAllMedicines() {
        return medicineRepository.findAll()
                .stream()
                .map(medicineMapper::toDto) // ✅ use mapper
                .collect(Collectors.toList());
    }

    // =======================
    // ✅ GET MEDICINE BY ID
    // =======================
    @Override
    public Optional<MedicineSearchResponseDTO> getMedicineByMedicineId ( Long medicineId ) {
        return medicineRepository.findById( medicineId )
                .map(medicineMapper::toDto); // ✅ use mapper
    }

    // ================================================
    // ✅ 🔍 SEARCH BY NAME ( YOUR MAIN REQUIREMENT )
    // ================================================
    @Override
    public List<MedicineSearchResponseDTO> searchMedicinesByMedicineName( String medicineName ) {
        return medicineRepository.findByMedicineNameContainingIgnoreCase( medicineName )
                .stream()
                .map(medicineMapper::toDto)
                .collect(Collectors.toList());
    }

    // =====================================
    // ✅ COMBINED SEARCH ( NAME + PRICE )
    // =====================================
    @Override
    public List<MedicineSearchResponseDTO> searchMedicines( String medicineName, double minPrice, double maxPrice ) {

        return medicineRepository
                .findByMedicineNameContainingIgnoreCaseAndPriceBetween( medicineName, minPrice, maxPrice )
                .stream()
                .map(medicineMapper::toDto)
                .collect(Collectors.toList());
    }

    // ==========================
    // ✅ FILTER BY PRICE RANGE
    // ==========================
    @Override
    public List<MedicineSearchResponseDTO> getMedicinesByPriceRange( double minPrice, double maxPrice ) {
        return medicineRepository.findByPriceBetween( minPrice, maxPrice )
                .stream()
                .map(medicineMapper::toDto)
                .collect(Collectors.toList());
    }

    // ======================
    // ✅ SAVE NEW MEDICINE
    // ======================
    @Override
    public MedicineSearchResponseDTO saveMedicine(MedicineRequestDTO medicineRequestDTO) {
        Medicine medicine = MedicineMapper.toEntity(medicineRequestDTO);
        return medicineMapper.toDto(medicineRepository.save(medicine)); // ✅ use mapper
    }

    // =========================
    // ✅ UPDATE MEDICINE
    // =========================
    @Override
    public Optional<MedicineSearchResponseDTO> updateMedicine( Long medicineId, MedicineRequestDTO medicineRequestDTO ) {
        return medicineRepository.findById( medicineId ).map(existing -> {
            MedicineMapper.updateEntity(existing, medicineRequestDTO);
            return medicineMapper.toDto(medicineRepository.save(existing));
        });
    }

    // =========================
    // ✅ DELETE MEDICINE
    // =========================
    @Override
    public void deleteMedicine ( Long medicineId ) {
        if ( !medicineRepository.existsById( medicineId ) ) {
            throw new RuntimeException( "Medicine not found with id: " + medicineId );
        }
        medicineRepository.deleteById( medicineId );
    }
}