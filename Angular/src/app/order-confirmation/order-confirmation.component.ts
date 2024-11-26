import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent {
  @Input() isVisible: boolean = false;
  @Input() items: any[] = [];
  @Input() total: number = 0;
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  ngOnInit() {
    console.log('OrderConfirmationComponent initialized');
  }

  ngOnChanges() {
    console.log('isVisible changed:', this.isVisible);
    console.log('items:', this.items);
    console.log('total:', this.total);
  }
}