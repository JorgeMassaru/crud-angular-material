import { Injectable } from '@angular/core';
import { Cliente } from './cadastro/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  static REPO_CLIENTES = "_CLIENTES";

  constructor() { }

  salvar(cliente: Cliente) {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const storage = this.obterStorage();
    storage.push(cliente);
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(storage));
  }

  atualizar(cliente: Cliente) {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const storage = this.obterStorage();
    storage.forEach(c => {
      if (c.id === cliente.id) {
        Object.assign(c, cliente);
      }
    });

    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(storage));
  }

  deletar(cliente: Cliente) {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const storage = this.obterStorage();
    const novaLista = storage.filter(c => c.id !== cliente.id);
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(novaLista));
  }

  pesquisarClientes(nome: string): Cliente[] {
    const clientes = this.obterStorage();
    const nomePesquisado = nome.trim().toLocaleLowerCase();

    if (!nomePesquisado) {
      return clientes;
    }

    return clientes.filter(cliente =>
      cliente.nome?.toLocaleLowerCase().indexOf(nomePesquisado) !== -1
    );
  }

  buscarClientePorId(id: string): Cliente | undefined {
    const clientes = this.obterStorage();
    return clientes.find(cliente => cliente.id === id)
  }

  private obterStorage(): Cliente[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const repositorioClientes = localStorage.getItem(ClienteService.REPO_CLIENTES);
    if (repositorioClientes) {
      const clientes: Cliente[] = JSON.parse(repositorioClientes);
      return clientes;
    }

    const clientes: Cliente[] = [];
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(clientes));
    return clientes;
  }
}
