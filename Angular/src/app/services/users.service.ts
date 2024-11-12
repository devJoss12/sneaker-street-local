import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy 
} from '@angular/fire/firestore';

export interface UserRecord {
  email: string;
  provider: string;
  created: Date;
  signedIn: Date;
  uid: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private firestore: Firestore = inject(Firestore);

  // Método existente
  async saveUserLogin(user: any): Promise<void> {
    try {
      console.log('Guardando usuario:', user);
      const userRef = doc(this.firestore, 'users', user.uid);
      const userData: UserRecord = {
        email: user.email,
        provider: user.providerId || 'google.com',
        created: new Date(user.metadata.creationTime),
        signedIn: new Date(),
        uid: user.uid
      };
      
      await setDoc(userRef, userData, { merge: true });
      console.log('Usuario guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      throw error;
    }
  }

  // Nuevo método para obtener usuarios
  async getUsers(): Promise<UserRecord[]> {
    try {
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, orderBy('signedIn', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          email: data['email'],
          provider: data['provider'],
          created: data['created'].toDate(),
          signedIn: data['signedIn'].toDate(),
          uid: data['uid']
        } as UserRecord;
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  // Nuevo método para eliminar usuarios
  async deleteUser(uid: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
}