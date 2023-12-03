import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [HttpClientModule,CommonModule,MatTableModule],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css'
})

export class UsersTableComponent {
  users: any[] = [];
  displayedColumns: string[] = ['id', 'username', 'email', 'created_at', 'updated_at'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.http.get('http://localhost:3001/users').subscribe((data: any) => {
      this.users = data;
    });
  }

  deleteUser(id: number) {
    // Send DELETE request
    this.http.delete(`http://localhost:3001/users/${id}`).subscribe(() => {
      // Remove the user from the array to update the UI
      this.users = this.users.filter(user => user.id !== id);
    });
  }
  
}
