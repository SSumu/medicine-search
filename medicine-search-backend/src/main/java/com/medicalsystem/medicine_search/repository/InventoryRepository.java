package com.medicalsystem.medicine_search.repository;

import com.medicalsystem.medicine_search.entity.Inventory;
import com.medicalsystem.medicine_search.entity.Medicine;
import com.medicalsystem.medicine_search.entity.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    // Search inventory by Medicine
    List<Inventory> findByMedicine(Medicine medicine);

    // Search inventory records by Pharmacy object
    List<Inventory> findByPharmacy(Pharmacy pharmacy);

    // Search specific inventory by Medicine and PharmacyComponent
//    Optional<Inventory> findByMedicineAndPharmacy(Medicine medicine, Pharmacy pharmacy);

    // Search inventory by pharmacy name (needed for Angular service)
    List<Inventory> findByPharmacy_PharmacyNameContainingIgnoreCase(String pharmacyName);

    // Search inventory by medicine name (useful for search feature)
    List<Inventory> findByMedicine_MedicineNameContainingIgnoreCase(String medicineName);

    // Search inventory by medicine name and sort by price (ascending)
    List<Inventory> findByMedicine_MedicineNameContainingIgnoreCaseOrderByPriceAsc(String medicineName);

    // Find available stock (quantity > 0)
    List<Inventory> findByQuantityGreaterThan(int quantity);

    // Find inventory by pharmacy location (if PharmacyComponent has location field)
    List<Inventory> findByPharmacy_PharmacyLocationContainingIgnoreCase(String location);
}
