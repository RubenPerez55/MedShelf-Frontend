import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Medkit } from './medkit';

describe('Medkit', () => {
  let component: Medkit;
  let fixture: ComponentFixture<Medkit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Medkit],
    }).compileComponents();

    fixture = TestBed.createComponent(Medkit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
