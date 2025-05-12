import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogTitle,  MatDialogActions, MatDialogClose, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule, MatSelectionList, MatListOption } from '@angular/material/list';

@Component({
  selector: 'app-lynis-rules',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatListModule,
    MatListOption,
    MatSelectionList
  ],
  templateUrl: './lynis-rules.component.html',
  styleUrl: './lynis-rules.component.css'
})
export class LynisRulesComponent {
  data = inject(MAT_DIALOG_DATA);
  selectedRules:string[]=[];
   dialogRef: MatDialogRef<LynisRulesComponent> = inject(MatDialogRef);
   save(rulesList: MatSelectionList): void {
      this.selectedRules=[];
    if (rulesList && rulesList.selectedOptions && rulesList.selectedOptions.selected.length > 0) {
      const selectedIds: ( string | undefined)[] = rulesList.selectedOptions.selected.map(option => option.value);

      selectedIds.forEach(id => {
        if (id !== undefined) {
          this.selectedRules.push(String(id)); // Convertiamo l'ID a stringa prima di inserirlo
        }
      });
      this.dialogRef.close(this.selectedRules);
      alert(`IDs degli elementi selezionati:\n- ${selectedIds.join('\n- ')}`);
    } else {
      alert('Nessun elemento selezionato.');
    }
  }

onCloseDialog(): void {
    this.dialogRef.close(undefined);
  }

}
