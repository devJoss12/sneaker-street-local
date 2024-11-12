import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService, UserRecord } from '../../services/users.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  private usersService = inject(UsersService);
  users: UserRecord[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      this.loading = true;
      this.error = null;
      this.users = await this.usersService.getUsers();
    } catch (error) {
      this.error = 'Error al cargar los usuarios';
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  async deleteUser(uid: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await this.usersService.deleteUser(uid);
        await this.loadUsers();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  }
}