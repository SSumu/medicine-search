package com.medicalsystem.medicine_search.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationship with PharmacyComponent
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pharmacy_id", nullable = false)
    @JsonIgnore
    private Pharmacy pharmacy;

    // Relationship with Medicine
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    @JsonIgnore
    private Medicine medicine;

    // Available quantity in stock
    @Column(nullable = false)
    private Integer quantity;

    // Price of the medicine at this pharmacy
    @Column(nullable = false)
    private Double price;

    // Optional: last updated timestamp
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    // ============================
    // DTO FIELDS (Derived Outputs)
    // ============================

    @JsonProperty("pharmacyName")
    public String getPharmacyName() {
        return pharmacy != null ? pharmacy.getPharmacyName() : null;
    }

    @JsonProperty("pharmacyLocation")
    public String getPharmacyLocation() {
        return pharmacy != null ? pharmacy.getPharmacyLocation() : null;
    }

    @JsonProperty("medicineName")
    public String getMedicineName() {
        return medicine != null ? medicine.getMedicineName() : null;
    }
}
