import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-delete-dialog',
  imports: [MatDialogModule, MatButton],
  templateUrl: './delete-dialog.html',
  styleUrl: './delete-dialog.scss'
})
export class DeleteDialog {
  readonly dialogRef = inject(MatDialogRef<DeleteDialog>);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
