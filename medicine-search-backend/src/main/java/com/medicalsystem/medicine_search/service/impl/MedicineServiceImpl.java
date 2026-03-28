package com.medicalsystem.medicine_search.service.impl;

import com.medicalsystem.medicine_search.dto.MedicineSearchResponseDTO;
import com.medicalsystem.medicine_search.entity.Inventory;
import com.medicalsystem.medicine_search.entity.Medicine;
import com.medicalsystem.medicine_search.exception.ResourceNotFoundException;
import com.medicalsystem.medicine_search.mapper.MedicineMapper;
import com.medicalsystem.medicine_search.repository.InventoryRepository;
import com.medicalsystem.medicine_search.repository.MedicineRepository;
import com.medicalsystem.medicine_search.service.MedicineService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;
    private final InventoryRepository inventoryRepository;
    private final MedicineMapper medicineMapper;

    public MedicineServiceImpl(MedicineRepository medicineRepository, InventoryRepository inventoryRepository, MedicineMapper medicineMapper) {
        this.medicineRepository = medicineRepository;
        this.inventoryRepository = inventoryRepository;
        this.medicineMapper = medicineMapper;
    }

    @Override
    public Optional<Medicine> getMedicineById(Long id) {
        return medicineRepository.findById(id);
    }

    @Override
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    @Override
    public List<MedicineSearchResponseDTO> searchMedicinesByName(String name) {

        List<Inventory> inventories =
                inventoryRepository.findByMedicine_NameContainingIgnoreCase(name);

        return inventories.stream()
                .map(medicineMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<Medicine> getMedicinesByPriceRange(double minPrice, double maxPrice) {
        return medicineRepository.findByPriceBetween(minPrice, maxPrice);
    }

    @Override
    public Medicine saveMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    @Override
    public Medicine updateMedicine(Long id, Medicine medicine) {
        Medicine existing = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id " + id));

        existing.setName(medicine.getName());
        existing.setPrice(medicine.getPrice());
        existing.setManufacturer(medicine.getManufacturer());

        return medicineRepository.save(existing);    }

    @Override
    public void deleteMedicine(Long id) {
        Medicine existing = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id " + id));

        medicineRepository.delete(existing);
    }

}
