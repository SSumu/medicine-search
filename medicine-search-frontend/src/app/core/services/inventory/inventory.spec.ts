import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  let component: InventoryService;
  let fixture: ComponentFixture<InventoryService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryService],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
