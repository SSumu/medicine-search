package com.medicalsystem.medicine_search.dto;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PharmacyScheduleDTO {

    private String day;
    private boolean open;
    private String openTime;
    private String closeTime;
}
