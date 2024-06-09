import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import { jsPDF } from 'jspdf'

export interface Tile {
  color?: string;
  cols: number;
  rows: number;
  text: string;
}

export interface Remedio {
  nome: string;
  quantidade: number;
  modoUso: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSlideToggle,
    MatGridList,
    MatGridTile,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  doc: jsPDF = new jsPDF();
  public form: FormGroup = this.formBuilder.group({
    nome: ['', Validators.required],
    endereco: ['', Validators.required],
    remedios: this.formBuilder.array([this.gerarFormRemedio()])
  });

  get remedios() {
    return this.form.controls['remedios'] as FormArray;
  }

  title = 'prescription1';

  constructor(private formBuilder: FormBuilder) {
  }

  public gerarFormRemedio() {
    return this.formBuilder.group({
      titulo: ['', Validators.required],
      quantidade: ['', Validators.required],
      modoUso: ['', Validators.required],
    })
  }

  public adicionarRemedio(): void {
    this.remedios.push(this.gerarFormRemedio())
    console.log(this.form)
  }

  public removerRemedio(index: number) {
    this.remedios.removeAt(index)
  }

  public imprimir() {
    console.log(this.form)
    const form = this.form.getRawValue()
    this.doc.text("UBS Vila Aparecida", 80, 15, {renderingMode: 'fillThenStroke'});
    this.doc.text("R. São Cristóvão, 365 - Aparecida", 60, 21);
    this.doc.text("Bragança Paulista - SP, 12912-530", 60, 27);

    this.doc.text(form.nome, 20, 40);
    this.doc.text(form.endereco, 20,50)

    let l1 = 80;
    let l2 = 90;

    for (let i = 0; i < form.remedios.length; i++) {
      this.doc.text((i + 1) + ". "+form.remedios[i].titulo, 20, l1);
      this.doc.text(form.remedios[i].quantidade, 175, l1);
      this.doc.text(form.remedios[i].modoUso, 20, l2);

      l1 += 20;
      l2 += 20;
    }

    this.doc.text("Dra. Marilia Funck de Lima", 70, 260);
    this.doc.text("CRM 228644", 85, 270);
    this.doc.save();
  }
}
