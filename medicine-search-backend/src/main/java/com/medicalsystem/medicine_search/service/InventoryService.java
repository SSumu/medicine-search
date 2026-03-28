package com.medicalsystem.medicine_search.service;

import com.medicalsystem.medicine_search.entity.Inventory;

import java.util.List;

public interface InventoryService {

    List<Inventory> getAllInventory();

    Inventory getInventoryById(Long id);

    List<Inventory> searchByMedicineName(String name);

    List<Inventory> searchByLocation(String location);

    List<Inventory> getAvailableStock();

    Inventory saveInventory(Inventory inventory);

    Inventory updateInventory(Long id, Inventory inventory);

    void deleteInventory(Long id);
}
