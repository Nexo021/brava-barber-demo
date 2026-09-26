# Brava Barber Studio — versão mobile-first

Esta versão foi refeita para funcionar bem desde celulares pequenos (280–320 px) até telas grandes.

## Melhorias principais

- Navegação inferior fixa no celular com: Início, Serviços, Agendar, Avaliações e Contato.
- Menu completo no topo para computador.
- Layout testado para 306 px, 390 px e desktop.
- Botões grandes para toque.
- Hero e títulos sem cortes horizontais.
- Páginas separadas de serviços, reservas e avaliações.
- Formulário de reserva com resumo automático e envio pelo WhatsApp.
- Formulário de avaliação com estrelas e envio pelo WhatsApp.
- Animações suaves, carrossel, contadores e acessibilidade básica.

## Como abrir

1. Abra a pasta no VS Code.
2. Clique com o botão direito em `index.html`.
3. Escolha **Open with Live Server**.

## Configuração obrigatória

Abra `assets/js/config.js` e troque:

- número de WhatsApp;
- telefone;
- endereço;
- link do Maps;
- link de avaliações do Google;
- Instagram.

O número do WhatsApp deve ficar somente com números:

```js
whatsappNumber: "5511999999999"
```

## Arquivos

- `index.html`: página inicial.
- `servicos.html`: serviços e preços.
- `reservas.html`: agendamento.
- `avaliacoes.html`: avaliações.
- `assets/css/styles.css`: todo o design responsivo.
- `assets/js/app.js`: animações, navegação, dados e carrossel.
- `assets/js/reservas.js`: lógica do agendamento.
- `assets/js/avaliacoes.js`: lógica do formulário de avaliação.

## Importante

A reserva é enviada pelo WhatsApp e precisa ser confirmada pelo negócio. As avaliações mostradas são demonstrativas. Uma avaliação pública real deve ser enviada ao Google ou passar por moderação antes de entrar no site.
