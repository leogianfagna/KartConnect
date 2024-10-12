// Aguarda o carregamento da página antes de executar o script
// Docs: https://getbootstrap.com/docs/5.3/forms/validation/
(() => {
    'use strict';

    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
           
        }, false);
    });
})();

/*
Função para usar quando for criar o botão de cadastro final, para mandar ao banco de dados.
Só nessa hora é necessário ver se o email está de fato com os padrões.

Provavelmente, vai ser colocado na função ao lado do if:

    if (!form.checkValidity() || !isEmailValid()) {
        event.preventDefault();
        ...

function isEmailValid() {
    const emailInput = document.getElementById('validation-email');
    if (emailInput != null) {
        let inputValue = emailInput.value;
        
        if (!inputValue.includes("@")) {
            return false;
        }

        if (!inputValue.includes(".com") || !inputValue.includes(".br")) {
            return false;
        }

        return true;
    }
}

function feedbackEmailMessage() {
    console.log(isEmailValid());
    if (!isEmailValid()) {
        document.getElementById('multiple-reasons').innerText = "Este e-mail não é válido.";
    }
}
*/