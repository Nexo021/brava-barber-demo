(() => {
  "use strict";

  const form = document.querySelector("#review-form");
  if (!form || !window.Brava) return;

  const ratingText = document.querySelector("[data-rating-label]");
  const ratingInputs = form.querySelectorAll('input[name="rating"]');
  const labels = {
    1: "Pode melhorar",
    2: "Regular",
    3: "Boa experiência",
    4: "Muito bom",
    5: "Excelente"
  };

  ratingInputs.forEach((input) => {
    input.addEventListener("change", () => {
      ratingText.textContent = labels[input.value] || "Selecione de 1 a 5 estrelas";
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const rating = String(data.get("rating") || "");
    const service = String(data.get("service") || "");
    const comment = String(data.get("comment") || "").trim();

    const message = [
      `Olá! Gostaria de enviar uma avaliação para a ${window.Brava.config.businessName}.`,
      "",
      `Nome: ${name}`,
      `Nota: ${rating}/5`,
      `Serviço: ${service}`,
      `Comentário: ${comment}`,
      "",
      "Autorizo a equipe a revisar e publicar este depoimento nos canais da barbearia."
    ].join("\n");

    window.Brava.toast("Avaliação preparada. Abrindo o WhatsApp…");
    window.open(window.Brava.whatsappUrl(message), "_blank", "noopener,noreferrer");
  });
})();
