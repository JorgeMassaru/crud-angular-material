import { Component, OnInit, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Cliente } from './cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { BrasilapiService } from '../brasilapi.service';
import { Estado, Municipio } from '../brasilapi.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit {

  cliente: Cliente = Cliente.newCliente();
  atualizando = false;
  snackBar = inject(MatSnackBar);
  estados: Estado[] = [];
  municipios: Municipio[] = [];

  constructor(
    private service: ClienteService,
    private brasilapiService: BrasilapiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        const clienteEncontrado = this.service.buscarClientePorId(id);
        if (clienteEncontrado) {
          this.atualizando = true;
          this.cliente = clienteEncontrado;
          if (this.cliente.uf) {
            const event = { value: this.cliente.uf } as MatSelectChange;
            this.carregarMunicipios(event);
          }
        }
      }
    });

    this.carregarUFs();
  }

  carregarUFs(): void {
    this.brasilapiService.listarUFs().subscribe({
      next: (listaEstados) => {
        this.estados = listaEstados;
        console.log('Lista de estados:', listaEstados);
      },
      error: (error) => console.error('Erro ao carregar estados:', error)
    });
  }

  carregarMunicipios(event: MatSelectChange): void {
    const ufSelecionada = event.value;

    if (!ufSelecionada) {
      this.municipios = [];
      return;
    }

    this.brasilapiService.listarMunicipios(ufSelecionada).subscribe({
      next: (listaMunicipios) => this.municipios = listaMunicipios,
      error: (erro) => console.error('Erro ao carregar municípios:', erro)
    });
  }

  salvar(): void {
    if (!this.atualizando) {
      this.service.salvar(this.cliente);
      this.cliente = Cliente.newCliente();
      this.mostrarMensagem('Cliente CADASTRADO com sucesso!');
      return;
    }

    this.service.atualizar(this.cliente);
    this.router.navigate(['/consulta']);
    this.mostrarMensagem('Cliente ATUALIZADO com sucesso!');
  }

  mostrarMensagem(mensagem: string): void {
    this.snackBar.open(mensagem, 'Ok', {
      duration: 3000
    });
  }
}
