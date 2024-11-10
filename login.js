// URL e chave pública do Supabase
const supabaseUrl = 'https://<SUPABASE_URL>'; // Substitua pelo URL do seu Supabase
const supabaseKey = 'public-anon-key'; // Substitua pela chave pública do Supabase

// Criação correta do cliente Supabase
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

console.log(supabase); // Verifica se o cliente foi criado corretamente

// Função para validar o login
async function validarLogin() {
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        // Consulta ao banco de dados Supabase
        const { data, error } = await supabase
            .from('usuarios')
            .select('id, email, senha')  // Supondo que 'usuarios' tenha os campos 'id', 'email', e 'senha'
            .eq('email', usuario)  // Comparando pelo email
            .single();  // Obtém um único usuário

    console.log(data);  // Verifique os dados retornados
    console.log(error); // Verifique o erro, se houver
    
     if (error || !data) {
            console.log('Erro ou usuário não encontrado:', error);
            errorMessage.textContent = 'Usuário ou senha incorretos!';
            return;
        }

        if (data.senha === senha) {
            console.log('Login bem-sucedido!');
            window.location.href = "pg.html";  // Redireciona para a página de pagamento
        } else {
            console.log('Senha incorreta');
            errorMessage.textContent = 'Usuário ou senha incorretos!';
        }
    } catch (error) {
        console.log('Erro durante a autenticação:', error);
        errorMessage.textContent = 'Erro no servidor. Tente novamente!';
    }
}

// Evento de submit do formulário
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Impede o envio padrão do formulário
    validarLogin();
});
