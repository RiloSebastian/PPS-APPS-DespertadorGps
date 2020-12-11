import { TestBed } from '@angular/core/testing';

import { ImagenesService } from './imagenes.service';

describe('ImagenesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImagenesService = TestBed.get(ImagenesService);
    expect(service).toBeTruthy();
  });
});
