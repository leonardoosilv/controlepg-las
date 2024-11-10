// Configuração do Supabase
const supabaseUrl = 'https://iltlyenxlkegbwoalihn.supabase.co';  // Substitua pelo URL do seu Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsdGx5ZW54bGtlZ2J3b2FsaWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyMDg2MzUsImV4cCI6MjA0Njc4NDYzNX0.kku-h687kIvvfAWycDE1OxT6TValyBSJbxxGpeXk4l4';  // Substitua pela chave pública do Supabase
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

console.log(supabase); // Verifica se o cliente foi criado corretamente

// Função para validar login com o Supabase
async function validarLogin() {
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Chama a API de autenticação do Supabase
    const { data, error } = await supabase
        .from('usuarios')
        .select('id, email, senha')
        .eq('email', usuario)
        .single(); // Espera um único usuário com esse email

    console.log(data);  // Verifique os dados retornados
    console.log(error); // Verifique o erro, se houver
    
    if (error) {
        console.log('Erro na consulta ao banco de dados:', error); // Exibe erro de consulta
        errorMessage.textContent = 'Usuário ou senha incorretos!';
        return;
    }

    if (data) {
        console.log('Usuário encontrado:', data);
        if (data.senha === senha) {
            console.log('Senha correta, redirecionando...');
            window.location.href = "pg.html"; // Redireciona para a página
        } else {
            console.log('Senha incorreta');
            errorMessage.textContent = 'Usuário ou senha incorretos!';
        }
    } else {
        console.log('Usuário não encontrado');
        errorMessage.textContent = 'Usuário ou senha incorretos!';
    }
}

// Evento de submit do formulário
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Impede o envio padrão do formulário
    validarLogin();
});
