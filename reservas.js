(() => {
  "use strict";

  const form = document.querySelector("#booking-form");
  if (!form || !window.Brava) return;

  const dateInput = form.querySelector("#booking-date");
  const timeSelect = form.querySelector("#booking-time");
  const barberSelect = form.querySelector("#booking-barber");
  const nameInput = form.querySelector("#booking-name");
  const phoneInput = form.querySelector("#booking-phone");
  const notesInput = form.querySelector("#booking-notes");

  const summaryService = document.querySelector("[data-summary-service]");
  const summaryBarber = document.querySelector("[data-summary-barber]");
  const summaryDate = document.querySelector("[data-summary-date]");
  const summaryTime = document.querySelector("[data-summary-time]");
  const summaryPrice = document.querySelector("[data-summary-price]");

  const localToday = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  dateInput.min = localToday;

  const money = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0
  });

  const selectedService = () => form.querySelector('input[name="service"]:checked');

  const formatDate = (value) => {
    if (!value) return "A escolher";
    const [year, month, day] = value.split("-").map(Number);
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" })
      .format(new Date(year, month - 1, day));
  };

  const updateSummary = () => {
    const service = selectedService();
    const barberText = barberSelect.options[barberSelect.selectedIndex]?.text || "Sem preferência";
    const timeText = timeSelect.value || "A escolher";
    const price = Number(service?.dataset.price || 0);

    summaryService.textContent = service?.dataset.label || "Selecione um serviço";
    summaryBarber.textContent = barberText;
    summaryDate.textContent = formatDate(dateInput.value);
    summaryTime.textContent = timeText;
    summaryPrice.textContent = money.format(price);
  };

  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get("service");
  if (requestedService) {
    const requested = form.querySelector(`input[name="service"][value="${CSS.escape(requestedService)}"]`);
    if (requested) requested.checked = true;
  }

  form.addEventListener("change", updateSummary);
  form.addEventListener("input", updateSummary);
  updateSummary();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const service = selectedService();
    const serviceLabel = service?.dataset.label || "Serviço";
    const price = Number(service?.dataset.price || 0);
    const barber = barberSelect.options[barberSelect.selectedIndex]?.text || "Sem preferência";
    const date = formatDate(dateInput.value);
    const time = timeSelect.value;
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const notes = notesInput.value.trim();

    const message = [
      `Olá! Quero agendar um horário na ${window.Brava.config.businessName}.`,
      "",
      `Nome: ${name}`,
      `Telefone: ${phone}`,
      `Serviço: ${serviceLabel} (${money.format(price)})`,
      `Profissional: ${barber}`,
      `Data preferida: ${date}`,
      `Horário: ${time}`,
      notes ? `Observações: ${notes}` : "",
      "",
      "Pode confirmar a disponibilidade, por favor?"
    ].filter(Boolean).join("\n");

    window.Brava.toast("Abrindo o WhatsApp para confirmar seu horário…");
    window.open(window.Brava.whatsappUrl(message), "_blank", "noopener,noreferrer");
  });
})();
