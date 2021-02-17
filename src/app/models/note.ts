import { IterableChangeRecord } from '@angular/core';

export interface Note {
  id: number;
  content: string;
  user: number;
  note_order: number;
}
