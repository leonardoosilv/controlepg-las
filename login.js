// Configuração do Supabase
const supabaseUrl = 'https://iltlyenxlkegbwoalihn.supabase.co';  // Substitua pelo URL do seu Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsdGx5ZW54bGtlZ2J3b2FsaWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyMDg2MzUsImV4cCI6MjA0Njc4NDYzNX0.kku-h687kIvvfAWycDE1OxT6TValyBSJbxxGpeXk4l4';  // Substitua pela chave pública do Supabase
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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
