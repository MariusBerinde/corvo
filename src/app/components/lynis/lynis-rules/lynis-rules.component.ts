import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule, MatSelectionList, MatListOption } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lynis-rules',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatListOption,
    MatSelectionList,
  ],
  templateUrl: './lynis-rules.component.html',
  styleUrl: './lynis-rules.component.css',
})
export class LynisRulesComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  dialogRef: MatDialogRef<LynisRulesComponent> = inject(MatDialogRef);

  searchControl = new FormControl('');
  selectedRules: string[] = this.data.acutalConfig.listIdSkippedTest;
  filteredAvailableRules: any[] = [];

  ngOnInit(): void {
    this.updateFilteredRules('');

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe((term) => {
        this.updateFilteredRules(term??'');
      });
  }

  private updateFilteredRules(search: string): void {
    const term = (search || '').toLowerCase();

    this.filteredAvailableRules = this.data.mini.filter(
      (rule: any) =>
        !this.selectedRules.includes(rule.id) &&
        (rule.id.toLowerCase().includes(term) ||
          rule.desc.toLowerCase().includes(term))
    );
  }

  save(rulesList: MatSelectionList): void {
    this.selectedRules = [];
    if ( rulesList && rulesList.selectedOptions && rulesList.selectedOptions.selected.length > 0) {
      const selectedIds: (string | undefined)[] =
        rulesList.selectedOptions.selected.map((option) => option.value);

      selectedIds.forEach((id) => {
        if (id !== undefined) {
          this.selectedRules.push(String(id));
        }
      });
      console.log(this.selectedRules);

      this.dialogRef.close(this.selectedRules);
    }
  }

  onCloseDialog(): void {
    this.dialogRef.close(undefined);
  }
  quit():void{
    this.dialogRef.close();
  }
}
