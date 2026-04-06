package com.medicalsystem.medicine_search.repository;

import com.medicalsystem.medicine_search.entity.Inventory;
import com.medicalsystem.medicine_search.entity.Medicine;
import com.medicalsystem.medicine_search.entity.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    // Search inventory by Medicine
    List<Inventory> findByMedicine(Medicine medicine);

    // Search inventory records by PharmacyComponent
    List<Inventory> findByPharmacy(Pharmacy pharmacy);

    // Search specific inventory by Medicine and PharmacyComponent
    Optional<Inventory> findByMedicineAndPharmacy(Medicine medicine, Pharmacy pharmacy);

    // Search inventory by medicine name (useful for search feature)
    List<Inventory> findByMedicine_NameContainingIgnoreCase(String name);

    // Search inventory by medicine name and sort by price (ascending)
    List<Inventory> findByMedicine_NameContainingIgnoreCaseOrderByPriceAsc(String name);

    // Find available stock (quantity > 0)
    List<Inventory> findByQuantityGreaterThan(int quantity);

    // Find inventory by pharmacy location (if PharmacyComponent has location field)
    List<Inventory> findByPharmacy_LocationContainingIgnoreCase(String location);
}
