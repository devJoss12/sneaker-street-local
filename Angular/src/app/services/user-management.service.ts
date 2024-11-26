
import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  User
} from '@angular/fire/auth';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private auth = inject(Auth);
  private functions = inject(Functions);

  async getAllUsers() {
    try {
      const listUsers = httpsCallable(this.functions, 'listUsers');
      const result = await listUsers();
      return result.data as any[];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async toggleUserStatus(uid: string, disabled: boolean) {
    try {
      const updateUser = httpsCallable(this.functions, 'updateUserStatus');
      await updateUser({ uid, disabled });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }
}