package com.medicalsystem.medicine_search.entity;

import com.medicalsystem.medicine_search.dto.PharmacyScheduleDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pharmacies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pharmacy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pharmacyId;

    @Column(nullable = false)
    private String pharmacyName;

    @Column(nullable = false)
    private String pharmacyLocation;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String country;

    @Column(nullable = false)
    private String contactNumber;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private Boolean available = true;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    protected void onCreate() {
        this.lastUpdated = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "pharmacy_schedule", joinColumns = @JoinColumn(name = "pharmacy_id"))
    private List<PharmacyScheduleDTO> schedule;

}
