import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCatalogoComponentComponent } from './test-catalogo-component.component';

describe('TestCatalogoComponentComponent', () => {
  let component: TestCatalogoComponentComponent;
  let fixture: ComponentFixture<TestCatalogoComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCatalogoComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCatalogoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
