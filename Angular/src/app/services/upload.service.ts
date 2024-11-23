import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

interface UploadResponse {
  status: string;
  message: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'http://localhost/sneaker_street_api/upload_image.php';

  constructor(private http: HttpClient) {}

  async uploadImage(file: File): Promise<string> {
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('La imagen no debe superar los 5MB');
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await lastValueFrom(
        this.http.post<UploadResponse>(this.apiUrl, formData)
      );
      
      console.log('Respuesta del servidor:', response);

      if (response && response.status === 'success') {
        return response.url;
      } else {
        throw new Error(response.message || 'Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error detallado:', error);
      if (error instanceof Error) {
        throw new Error(`Error al subir imagen: ${error.message}`);
      } else {
        throw new Error('Error desconocido al subir imagen');
      }
    }
  }
}