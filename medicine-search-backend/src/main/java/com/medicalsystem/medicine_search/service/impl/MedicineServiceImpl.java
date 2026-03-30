package com.medicalsystem.medicine_search.service.impl;

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

    // ✅ Get all medicines
    @Override
    public List<MedicineSearchResponseDTO> getAllMedicines() {
        return medicineRepository.findAll()
                .stream()
                .map(medicineMapper::toDto) // ✅ use mapper
                .collect(Collectors.toList());
    }

    // ✅ Get medicine by ID
    @Override
    public Optional<MedicineSearchResponseDTO> getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .map(medicineMapper::toDto); // ✅ use mapper
    }

    // ✅ 🔍 Search by name (Your main requirement)
    @Override
    public List<MedicineSearchResponseDTO> searchMedicinesByName(String name) {
        return medicineRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(medicineMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Combined search (name + price)
    @Override
    public List<MedicineSearchResponseDTO> searchMedicines(String name, double minPrice, double maxPrice) {

        return medicineRepository
                .findByNameContainingIgnoreCaseAndPriceBetween(name, minPrice, maxPrice)
                .stream()
                .map(medicineMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Filter by price range
    @Override
    public List<MedicineSearchResponseDTO> getMedicinesByPriceRange(double minPrice, double maxPrice) {
        return medicineRepository.findByPriceBetween(minPrice, maxPrice)
                .stream()
                .map(medicineMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Save new medicine
    @Override
    public MedicineSearchResponseDTO saveMedicine(Medicine medicine) {
        Medicine saved = medicineRepository.save(medicine);
        return medicineMapper.toDto(saved); // ✅ use mapper
    }

    // ✅ Update medicine
    @Override
    public Optional<MedicineSearchResponseDTO> updateMedicine(Long id, Medicine updatedMedicine) {
        return medicineRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedMedicine.getName());
                    existing.setPrice(updatedMedicine.getPrice());
                    existing.setManufacturer(updatedMedicine.getManufacturer());
                    existing.setDescription(updatedMedicine.getDescription());

                    Medicine saved = medicineRepository.save(existing);
                    return medicineMapper.toDto(saved); // ✅ use mapper
                });
    }

    // ✅ Delete medicine
    @Override
    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }
}