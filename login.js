    // Função de validação de login
    function validarLogin() {
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
        const errorMessage = document.getElementById('errorMessage');
        
        // Usuário e senha predefinidos
        const usuarioValido = 'admin';
        const senhaValida = 'admin';

        if (usuario === usuarioValido && senha === senhaValida) {
            // Redireciona para outra página
            window.location.href = "pg.html";  // Altere para a página de destino
        } else {
            // Exibe mensagem de erro
            errorMessage.textContent = 'Usuário ou senha incorretos!';
        }
    }

    // Evento de submit do formulário
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();  // Impede o envio padrão do formulário
        validarLogin();
    });