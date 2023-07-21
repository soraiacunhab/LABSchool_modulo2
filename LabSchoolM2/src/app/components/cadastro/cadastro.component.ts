import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUsuario } from 'src/app/interfaces/IUsuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {

  cadastroForm: FormGroup;

  constructor(private router: Router, private authService: AuthService) {
    this.cadastroForm = new FormGroup({
      'nome': new FormControl('', [Validators.required]),
      'telefone': new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
      'dataNascimento': new FormControl(this.formatarDataAtual(), [Validators.required]),
      'cpf': new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'senha': new FormControl('', [Validators.required, Validators.min(8)]),
      'confirmacaoSenha': new FormControl('', [Validators.required, Validators.min(8), this.confirmacaoSenhaValidator()])
    });
  }

  async onSubmit() {
    const usuario: IUsuario = {
      nomeCompleto: this.cadastroForm.get('nome')?.value,
      telefone: this.cadastroForm.get('telefone')?.value,
      dataNascimento: this.cadastroForm.get('dataNascimento')?.value,
      cpf: this.cadastroForm.get('cpf')?.value,
      email: this.cadastroForm.get('email')?.value,
      senha: this.cadastroForm.get('senha')?.value
    };

    await this.authService.registrar(usuario);
    this.router.navigate(['login']);
  }

  validateErrorMessage(field: string) {
    return this.cadastroForm.get(field)?.invalid && this.cadastroForm.get(field)?.touched;
  }

  validarMensagemErroConfirmacaoSenha() {
    const campo = this.cadastroForm.get('confirmacaoSenha'); 
    return campo?.errors && campo?.hasError('confirmacaoSenhaInvalida') && campo?.touched;
  }

  formatarDataAtual() {
    const dataAtual = new Date();
    const dia = dataAtual.getDate();
    let mes: string | number = dataAtual.getMonth() + 1;
    const ano = dataAtual.getFullYear();
    mes = mes >= 10 ? mes : `0${mes}`;
    return `${ano}-${mes}-${dia}`;
  }

  confirmacaoSenhaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.cadastroForm == null) return null;
      const senha = this.cadastroForm.get('senha')?.value;
      const confirmacaoSenha = this.cadastroForm.get('confirmacaoSenha')?.value;
      if (senha != confirmacaoSenha)
        return { 'confirmacaoSenhaInvalida': true }
      else
        return null;
    }
  }

}