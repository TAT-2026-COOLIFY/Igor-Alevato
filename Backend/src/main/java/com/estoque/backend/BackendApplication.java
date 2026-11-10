package com.estoque.backend;

import com.estoque.backend.model.Categoria;
import com.estoque.backend.model.Usuario;
import com.estoque.backend.repository.CategoriaRepository;
import com.estoque.backend.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.TimeZone;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}


	@PostConstruct
	public void iniciarFusoHorario() {
		TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
	}


	@Bean
	public CommandLineRunner iniciarSistema(UsuarioRepository usuarioRepository, CategoriaRepository categoriaRepository) {
		return args -> {
			//Conta quantos usuários existem no banco.
			if (usuarioRepository.count() == 0) {
				Usuario admin = new Usuario();
				admin.setNome("Administrador Padrão");
				admin.setUsuario("admin");
				admin.setSenha("1234");

				// Ligando todos permissão
				admin.setPodeGerenciarProdutos(true);
				admin.setPodeFazerEntrada(true);
				admin.setPodeFazerSaida(true);
				admin.setPodeGerenciarUsuarios(true);

				usuarioRepository.save(admin);
				System.out.println(" SISTEMA INICIADO: Usuário 'admin' padrão criado com sucesso!");
			}

			//  cria a categoria 'Teste'
			if (categoriaRepository.count() == 0) {
				Categoria categoriaPadrao = new Categoria();
				categoriaPadrao.setNome("Teste");

				categoriaRepository.save(categoriaPadrao);
				System.out.println("SISTEMA INICIADO: Categoria padrão 'Teste' criada com sucesso!");
			}
		};
	}
}