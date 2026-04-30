package com.medicalsystem.medicine_search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaginatedResponseDTO<T> {

    private List<T> content;
    private int page;
//    private int size;
    private long totalElements;
    private int totalPages;

    public static <T> PaginatedResponseDTO<T> from(Page<T> page) {
        return PaginatedResponseDTO.<T>builder()
                .content(page.getContent())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .page(page.getNumber())
//                .size(page.getSize())
                .build();
    }
}
